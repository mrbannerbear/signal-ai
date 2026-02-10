"use server";

import { createClient } from "@/app/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { jobAnalysisOutputSchema, type JobAnalysisOutput } from "@/schemas/job-analysis.schema";
import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";
import { getGeminiApiKey } from "@/utils/getEnv";
import { toast } from "sonner";

const ANALYSIS_MODEL = "gemini-2.5-flash";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

class AnalysisError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AnalysisError";
  }
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch {
    if (retries === 0) toast.error("Failed to analyze job after multiple attempts.");
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (MAX_RETRIES - retries + 1)));
    return withRetry(fn, retries - 1);
  }
}

function sanitizeInput(input: string | null | undefined): string {
  if (!input) return "Not specified";
  return input
    .replace(/```/g, "")
    .replace(/{{/g, "")
    .replace(/}}/g, "")
    .trim();
}

function parseSkills(skills: unknown): string {
  if (!skills) return "Not specified";
  
  try {
    const parsed = typeof skills === "string" ? JSON.parse(skills) : skills;
    if (Array.isArray(parsed)) {
      return parsed
        .map((s) => (typeof s === "string" ? s : s?.name))
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    return typeof skills === "string" ? sanitizeInput(skills) : "Not specified";
  }
  
  return "Not specified";
}

export async function analyzeJob(
  jobId: string,
  profileId: string | null
): Promise<JobAnalysisOutput> {
  if (!jobId) {
    throw new AnalysisError("Job ID is required", "INVALID_INPUT");
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("analysis")
    .select("content")
    .eq("job_id", jobId)
    .eq("profile_id", profileId)
    .maybeSingle();

  if (existing?.content) {
    const validation = jobAnalysisOutputSchema.safeParse(existing.content);
    if (validation.success) {
      return validation.data;
    }
    console.warn("Cached analysis failed validation, regenerating...");
  }

  const [jobResult, profileResult] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", jobId).single(),
    profileId
      ? supabase.from("profiles").select("*").eq("id", profileId).single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (jobResult.error || !jobResult.data) {
    throw new AnalysisError("Job not found", "JOB_NOT_FOUND", jobResult.error);
  }

  const job = jobResult.data;
  const profile = profileResult.data;

  const apiKey = getGeminiApiKey();

  const ai = new GoogleGenAI({ apiKey });

  const analysisResult = await withRetry(async () => {
    const { systemPrompt, userPrompt } = buildPrompts(job, profile);

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3
      },
    });

    const text = await response.text;
    if (!text) {
      throw new AnalysisError("Empty response from AI", "EMPTY_RESPONSE");
    }

    const parsed = JSON.parse(text);
    console.log("AI Response (raw):", JSON.stringify(parsed, null, 2));
    return parsed as JobAnalysisOutput;
  });

  const validation = jobAnalysisOutputSchema.safeParse(analysisResult);
  if (!validation.success) {
    console.error("Schema validation failed:", validation.error);
    throw new AnalysisError(
      "AI output validation failed",
      "VALIDATION_ERROR",
      validation.error.issues
    );
  }

  const content = validation.data;

  const analyticsData = {
    analysis_summary: content.analysisSummary,
    overall_fit_score: content.overallFitScore.score,
    overall_fit_label: content.overallFitScore.label,
    risk_level: content.gaps.riskLevel,
    confidence: content.overallFitScore.confidence,
    dimension_scores: content.overallFitScore.dimensionScores,
  };

  const { error: upsertError } = await supabase.from("analysis").upsert(
    {
      job_id: jobId,
      profile_id: profileId,
      content,
      ...analyticsData,
    },
    { onConflict: "job_id,profile_id" }
  );

  if (upsertError) {
    console.error("Failed to save analysis:", upsertError);
  } else {
    // Revalidate dashboard to update insights
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/dashboard");
  }

  return content;
}

function buildPrompts(
  job: Job,
  profile: Profile
): { systemPrompt: string; userPrompt: string } {
  const skillsList = parseSkills(profile?.skills);

  const systemPrompt = `You are an expert job analyst and career coach with deep expertise in recruitment, talent assessment, and career development.

YOUR MISSION:
Analyze job postings against candidate profiles to produce high-signal, actionable insights.

STRICT QUALITY RULES:
1. NO GENERIC ADVICE - Every suggestion must be specific to this job and candidate
2. CONCRETE EXAMPLES - Prefer specific rewrites over abstract tips
3. HONEST ASSESSMENT - Don't inflate scores or hide weaknesses
4. ACTIONABLE OUTPUTS - All recommendations must be implementable
5. EMPTY OVER FLUFF - Return empty arrays rather than generic filler

OUTPUT REQUIREMENTS:
- analysisSummary: 2-3 sentences capturing the core candidate-job fit for list previews
- biggestStrengths: Top 3-5 reasons this candidate stands out for THIS role
- improvementAreas: Top 3-5 specific gaps or weaknesses to address
- Dimension scores must reflect actual fit, not aspirational scores
- Confidence score should reflect data quality and certainty`;

  // User prompt: Specific data for this analysis
  const userPrompt = `# Job Details
Title: ${sanitizeInput(job.title)}
Company: ${sanitizeInput(job.company)}
Location: ${sanitizeInput(job.location)}
Employment Type: ${sanitizeInput(job.employment_type)}
Experience Level: ${sanitizeInput(job.experience_level)}
Compensation: ${sanitizeInput(job.compensation)}

## Job Description
${sanitizeInput(job.description)}

## Requirements
${sanitizeInput(job.requirements)}

## Responsibilities
${sanitizeInput(job.responsibilities)}

${
  profile
    ? `# Candidate Profile
Name: ${sanitizeInput(profile.first_name)} ${sanitizeInput(profile.last_name)}
Current Title: ${sanitizeInput(profile.headline)}
Location: ${sanitizeInput(profile.location)}
Skills: ${skillsList}
Bio/Experience: ${sanitizeInput(profile.bio)}

TONE: Address the candidate as "you" - act as their personal career coach.`
    : `# No Candidate Profile
Provide analysis for a typical qualified applicant. Use third-person tone.`
}

Analyze this job posting ${profile ? "against the candidate's profile" : ""} and return your assessment.

IMPORTANT: Return ONLY a valid JSON object matching this exact structure (no markdown, no code blocks):
{
  "analysisSummary": "string - 2-3 sentence executive summary",
  "summary": {
    "overview": "string - detailed overview of the job and fit",
    "keyPoints": ["string array - 1 to 7 key points"]
  },
  "skills": {
    "required": ["string array - skills required by the job"],
    "preferred": ["string array - nice-to-have skills"],
    "matchingSkills": ["string array - candidate's matching skills"]
  },
  "gaps": {
    "missingSkills": ["string array - skills the candidate lacks"],
    "riskLevel": "medium",
    "recommendations": [{"skill": "string", "action": "string", "timeEstimate": "string"}]
  },
  "seniority": {
    "level": "senior",
    "yearsExpected": "string - e.g. 3-5 years",
    "candidateFit": "string - honest assessment"
  },
  "location": {
    "type": "remote",
    "location": "string - city/country or Remote",
    "relocationRequired": false,
    "candidateMatch": "string - how location affects candidacy"
  },
  "suggestions": {
    "resumeEdits": [
      {
        "targetSection": "Experience",
        "why": "string - which job requirement this addresses",
        "exampleRewrite": "string - specific bullet you could add or modify"
      }
    ],
    "interviewAngles": [{"topic": "string", "whyTheyCare": "string", "howToAnswer": "string"}],
    "redFlags": [{"risk": "string", "mitigation": "string"}]
  },
  "overallFitScore": {
    "score": 75,
    "explanation": "string - why this score",
    "biggestStrengths": ["array of 3-5 specific strengths"],
    "improvementAreas": ["array of 0-5 specific areas to improve"],
    "label": "Good Fit",
    "confidence": 85,
    "dimensionScores": {
      "skillsFit": 80,
      "experienceFit": 70,
      "seniorityFit": 75,
      "locationFit": 90
    }
  }
}

CRITICAL VALIDATION RULES:
- riskLevel: Use ONLY: "low", "medium", or "high"
- seniority.level: Use ONLY: "junior", "mid", "senior", "lead", or "executive"
- location.type: Use ONLY: "remote", "hybrid", or "onsite"
- overallFitScore.label: Use ONLY: "Strong Match", "Good Fit", "Moderate Fit", "Weak Match", or "Poor Fit"
- targetSection: Use ONLY: "Experience", "Skills", or "Summary"
- All scores are numbers 0-100
- keyPoints must have at least 1 item and at most 7 items
- biggestStrengths must have at least 1 item`;

  return { systemPrompt, userPrompt };
}

