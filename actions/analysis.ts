"use server";
import { OpenRouter } from "@openrouter/sdk"
import { createClient } from "@/app/lib/supabase/server";

export async function analyzeJob(jobId: string, profileId: string | null) {
  const supabase = await createClient();

  // Check for existing analysis
  const { data: existing } = await supabase
    .from("analysis")
    .select("*")
    .eq("job_id", jobId)
    .eq("profile_id", profileId)
    .single();

  if (existing) {
    return existing.content;
  }

  // Fetch job
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (jobError || !job) {
    throw new Error("Job not found");
  }

  // Fetch profile if provided
  let profile = null;
  if (profileId) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();
    profile = data;
  }

  const ai = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

   const response = await ai.callModel({
    model: "openai/gpt-4o-mini", // Use a model that supports structured outputs
    input: generatePrompt(job, profile),
  });

  const text = await response.getText() ?? "";
  console.log("LLM Response:", text);
  const jsonMatch =
    text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Failed to parse LLM response");
  }

  const content = JSON.parse(jsonMatch[1] || jsonMatch[0]);

  // Save to database
  const { error: insertError } = await supabase
  .from("analysis")
  .upsert(
      { job_id: jobId, profile_id: profileId, content },
      { onConflict: "job_id,profile_id" }
    );

  if (insertError) {
    console.error("Insert error:", insertError);
    // Still return the result even if save fails
  }

  return content;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generatePrompt(job: any, profile: any): string {
  let skillsList = "Not specified";

  if (profile?.skills) {
    try {
      const skills =
        typeof profile.skills === "string"
          ? JSON.parse(profile.skills)
          : profile.skills;

      if (Array.isArray(skills)) {
        skillsList = skills
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((s: any) => (typeof s === "string" ? s : s.name))
          .join(", ");
      }
    } catch {
      skillsList = "Not specified";
    }
  }

  const profileSection = profile
    ? `
## Candidate Profile
IMPORTANT:
- Refer to the candidate directly as "you"
- Give advice as a pragmatic career coach
- Avoid generic career advice

- Name: ${profile.first_name || ""} ${profile.last_name || ""}
- Title: ${profile.headline || "Not specified"}
- Location: ${profile.location || "Not specified"}
- Skills: ${skillsList}
- Bio/Experience: ${profile.bio || "Not specified"}
`
    : `
No candidate profile provided.
Give analysis that applies to a typical applicant for this role.
`;

  return `
You are an expert job analyst and career coach.

Your task is to analyze the job posting ${
    profile ? "against the candidate profile" : ""
  } and produce ONLY high-signal, job-specific insights.

STRICT RULES:
- Do NOT give generic advice.
- Every suggestion must be tied to a specific job requirement or profile detail.
- If advice would apply to most frontend jobs, OMIT IT.
- Prefer concrete rewrites and examples over abstract tips.
- If a section has no meaningful output, return an empty array.
- Do not invent skills or experience not present in the profile.

## Job Details
- Title: ${job.title}
- Company: ${job.company}
- Location: ${job.location || "Not specified"}
- Employment Type: ${job.employment_type || "Not specified"}
- Experience Level: ${job.experience_level || "Not specified"}
- Description: ${job.description || "Not specified"}
- Requirements: ${job.requirements || "Not specified"}
- Compensation: ${job.compensation || "Not specified"}

${profileSection}

Return a JSON object with EXACTLY this structure:

{
  "summary": {
    "overview": "2–3 sentence role summary focused on impact and expectations",
    "keyPoints": ["3–5 concrete responsibilities or expectations"]
  },
  "skills": {
    "required": ["skills explicitly required by the job"],
    "preferred": ["skills listed as nice-to-have"],
    "matchingSkills": ["skills you already have that match the job"]
  },
  "gaps": {
    "missingSkills": ["important skills you lack"],
    "riskLevel": "low | medium | high",
    "recommendations": [
      {
        "skill": "missing skill",
        "action": "specific way to address it",
        "timeEstimate": "days | weeks | months"
      }
    ]
  },
  "seniority": {
    "level": "junior | mid | senior | lead | executive",
    "yearsExpected": "X–Y years",
    "candidateFit": "short, honest assessment of fit"
  },
  "location": {
    "type": "remote | hybrid | onsite",
    "location": "city, country or Remote",
    "relocationRequired": false,
    "candidateMatch": "how your location affects candidacy"
  },
  "suggestions": {
    "resumeEdits": [
      {
        "targetSection": "Experience | Project | Skills",
        "why": "which job requirement this addresses",
        "exampleRewrite": "specific bullet you could add or modify"
      }
    ],
    "interviewAngles": [
      {
        "topic": "specific topic to prepare",
        "whyTheyCare": "why this matters for THIS role",
        "howToAnswer": "angle you should take"
      }
    ],
    "redFlags": [
      {
        "risk": "what might weaken your candidacy",
        "mitigation": "how to offset or explain it"
      }
    ]
  },
  "overallFitScore": {
    "score": 0,
    "explanation": "why this score was given",
    "
  }
}

Return ONLY valid JSON wrapped in \`\`\`json code blocks.
No prose. No markdown outside JSON.
`;
}