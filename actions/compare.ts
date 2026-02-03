"use server";

import { createClient } from "@/app/lib/supabase/server";
import {
  AnalysisResultSchema,
  CreateAnalysisRunSchema,
} from "@/schemas/analysis.schema";
import getUserOnServer from "@/utils/getUserOnServer";
import { AnalysisSection } from "./../schemas/analysis.schema";
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

const POLL_INTERVAL = 5000; // 5 seconds
const sections: AnalysisSection[] = [
  "summary",
  "skills",
  "gaps",
  "seniority",
  "location",
  "suggestions",
];

// Updates the analysis run status and triggers the worker
export async function analysisWorker() {
  const supabase = await createClient();

  while (true) {
    try {
      const { data: run, error } = await supabase
        .from("analysis_run")
        .update({ status: "running", started_at: new Date().toISOString() })
        .eq("status", "queued")
        .limit(1)
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") console.error(error);
      if (!run) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL));
        continue;
      }

      console.log(`Processing run ${run.id}`);

      let sectionFailed = false;

      for (const section of sections) {
        try {
          const resultContent = await performLLMAnalysis(
            run.job_id,
            run.profile_id,
            section,
          );

          const { error: insertError } = await supabase
            .from("analysis_result")
            .insert({
              analysis_run_id: run.id,
              section,
              content: resultContent,
            });

          if (insertError) throw insertError;

          console.log(`Inserted ${section} for run ${run.id}`);
        } catch (sectionError) {
          console.error(
            `Section failed ${section} for run ${run.id}:`,
            sectionError,
          );
          sectionFailed = true;
        }
      }

      const finalStatus = sectionFailed ? "failed" : "completed";
      const { error: updateError } = await supabase
        .from("analysis_run")
        .update({
          status: finalStatus,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id);

      if (updateError) console.error("Error updating run status:", updateError);

      console.log(`Run ${run.id} finished with status ${finalStatus}`);
    } catch (err) {
      console.error("Worker error:", err);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
}

// calls an LLM to perform analysis
export const performLLMAnalysis = async (
  jobId: string,
  profileId: string | null,
  section: AnalysisSection,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const supabase = await createClient();
  await getUserOnServer();

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
  const resultContent = JSON.parse(aiResponse.text);
  return resultContent;
};

function generatePrompt(
  section: AnalysisSection,
  job: Job,
  profile: Profile | null,
) {
  return `You are a career AI assistant. You are given:

    1. Job description:
    ${job.description}

    2. Full candidate profile:
    ${profile}

    Task: Identify which required skills from the job are present in the candidate's profile and which are missing.

    Output strictly as JSONB for the section "${section}" according to the AnalysisResultSchema.`;
}

// Server action to run analysis
export async function runAnalysis(rawInput: unknown) {
  return await createAnalysisProcess(rawInput);
}
