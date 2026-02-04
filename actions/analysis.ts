"use server";

import { createClient } from "@/app/lib/supabase/server";
import {
  AnalysisResultSchema,
  CreateAnalysisRunSchema,
} from "@/schemas/analysis.schema";
import getUserOnServer from "@/utils/getUserOnServer";
import { AnalysisSection } from "../schemas/analysis.schema";
import { GoogleGenAI } from "@google/genai";
import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";

// Server action to create or get existing analysis run
export async function createAnalysisProcess(rawInput: unknown) {
  const supabase = await createClient();
  const user = await getUserOnServer();

  const input = CreateAnalysisRunSchema.parse(rawInput);
  const { job_id, profile_id } = input;

  const { data: existingRun } = await supabase
    .from("analysis_run")
    .select("*")
    .eq("user_id", user.id)
    .eq("job_id", job_id)
    .eq("profile_id", profile_id)
    .in("status", ["queued", "running"])
    .maybeSingle();

  if (existingRun) {
    return {
      run: existingRun,
      reused: true,
    };
  }

  const { data: newRun, error: insertError } = await supabase
    .from("analysis_run")
    .insert({
      user_id: user.id,
      job_id,
      profile_id,
      status: "queued",
    })
    .select()
    .single();

  if (insertError) {
    console.error("Error creating new analysis run", insertError);
    throw new Error("Failed to create analysis run");
  }

  return {
    run: newRun,
    reused: false,
  };
}

// calls an LLM to perform analysis
export const performLLMAnalysis = async (
  jobId: string,
  profileId: string | null,
  section: AnalysisSection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  externalSupabase?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const supabase = externalSupabase ?? (await createClient());

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();
  if (jobError || !job) throw jobError || new Error("Job not found");

  let profile = null;
  if (profileId) {
    const { data: prof, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();
    if (profileError) throw profileError;
    profile = prof;
  }

  const prompt = generatePrompt(section, job, profile);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: AnalysisResultSchema.toJSONSchema(),
    },
  });

  if (!aiResponse.text) throw new Error("AI response is empty");
  const parsed = AnalysisResultSchema.parse(JSON.parse(aiResponse.text));
  return parsed;
};

function generatePrompt(
  section: AnalysisSection,
  job: Job,
  profile: Profile | null,
) {
  const baseContext = `
You are a strict, analytical career AI.

You are given:
1. Job description:
${job.description}

2. Full candidate profile (all sections combined):
${JSON.stringify(profile, null, 2)}

Rules:
- Consider the ENTIRE profile holistically.
- Do not assume missing data means lack of skill.
- Only output valid JSON matching AnalysisResultSchema.
`;

  const sectionTaskMap: Record<AnalysisSection, string> = {
    summary: `
Generate a concise, factual summary of how well the candidate matches the job.
No advice. No fluff. Just assessment.
`,
    skills: `
List required job skills that are present vs missing.
Only include skills explicitly or implicitly demonstrated.
`,
    gaps: `
Identify concrete gaps between job requirements and candidate profile.
Do NOT repeat skills already listed as missing unless justified.
`,
    seniority: `
Assess whether the candidate's experience level matches the job seniority.
Explain briefly with evidence.
`,
    location: `
Assess location compatibility (remote / onsite / relocation).
Do not guess willingness.
`,
    suggestions: `
Provide actionable suggestions to improve alignment with THIS job.
No generic resume tips.
`,
  };

  return `
${baseContext}

SECTION TASK (${section.toUpperCase()}):
${sectionTaskMap[section]}

Output ONLY valid JSON for section "${section}".
`;
}


export async function getAnalysisResults(analysisRunId : string) {
  const supabase = await createClient();
  const { data: results, error } = await supabase
    .from("analysis_result")
    .select("*")
    .eq("analysis_run_id", analysisRunId);

  if (error) {
    console.error("Error fetching analysis results:", error);
    throw error;
  }

  return results;
}