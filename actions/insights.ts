"use server";

import { createClient } from "@/app/lib/supabase/server";
import getUserOnServer from "@/utils/getUserOnServer";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

import type { UserInsights, AnalysisSummaryData } from "./insights/types";
import { mapToAnalysisSummary } from "./insights/mappers";
import {
  computeAnalysisHash,
  deduplicateAndCap,
  safeAverage,
  buildInsightsSummaryPrompt,
} from "./insights/utils";

export async function getAllUserAnalyses(): Promise<{
  analyses: AnalysisSummaryData[];
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const user = await getUserOnServer();

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile?.id) {
      return { analyses: [], error: null };
    }

    const { data: analyses, error } = await supabase
      .from("analysis")
      .select(`
        job_id,
        analysis_summary,
        overall_fit_score,
        overall_fit_label,
        risk_level,
        top_strengths,
        top_weaknesses,
        jobs!inner(title, company)
      `)
      .eq("profile_id", profile.id);

    if (error) {
      console.error("Error fetching analyses:", error);
      return { analyses: [], error: error.message };
    }

    const mapped = (analyses || []).map((a) =>
      mapToAnalysisSummary(a as unknown as Record<string, unknown>)
    );

    return { analyses: mapped, error: null };
  } catch (err) {
    console.error("getAllUserAnalyses error:", err);
    return { analyses: [], error: "Failed to fetch analyses" };
  }
}

export async function getUserInsights(): Promise<{
  insights: UserInsights | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const user = await getUserOnServer();

    const { data, error } = await supabase
      .from("user_insights")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching insights:", error);
      return { insights: null, error: error.message };
    }

    return { insights: data, error: null };
  } catch (err) {
    console.error("getUserInsights error:", err);
    return { insights: null, error: "Failed to fetch insights" };
  }
}

/**
 * Regenerate user insights with AI summary (only if hash changed)
 */
export async function regenerateInsights(force = false): Promise<{
  insights: UserInsights | null;
  regenerated: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const user = await getUserOnServer();

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    // Fetch all analyses
    const { analyses, error: analysesError } = await getAllUserAnalyses();
    if (analysesError) {
      return { insights: null, regenerated: false, error: analysesError };
    }

    if (analyses.length === 0) {
      return { insights: null, regenerated: false, error: null };
    }

    // Compute hash
    const newHash = computeAnalysisHash(analyses);

    // Check existing insights
    const { insights: existing } = await getUserInsights();

    // Skip regeneration if hash unchanged and not forced
    if (!force && existing?.last_analysis_hash === newHash) {
      return { insights: existing, regenerated: false, error: null };
    }

    // Aggregate data
    const allStrengths = analyses.flatMap((a) => a.top_strengths || []);
    const allWeaknesses = analyses.flatMap((a) => a.top_weaknesses || []);
    const avgScore = safeAverage(analyses.map((a) => a.overall_fit_score));

    const uniqueStrengths = deduplicateAndCap(allStrengths);
    const uniqueWeaknesses = deduplicateAndCap(allWeaknesses);

    // Generate AI summary
    let overallSummary: string | null = null;
    try {
      const prompt = buildInsightsSummaryPrompt(analyses);
      if (prompt) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });
        overallSummary = response.text || null;
      }
    } catch (aiError) {
      console.error("AI summary generation failed:", aiError);
    }

    // Upsert insights
    const insightsData = {
      user_id: user.id,
      profile_id: profile?.id || null,
      overall_summary: overallSummary,
      aggregated_strengths: uniqueStrengths,
      aggregated_weaknesses: uniqueWeaknesses,
      average_fit_score: avgScore,
      analysis_count: analyses.length,
      last_analysis_hash: newHash,
      updated_at: new Date().toISOString(),
    };

    const { data: upserted, error: upsertError } = await supabase
      .from("user_insights")
      .upsert(insightsData, { onConflict: "user_id" })
      .select()
      .single();

    if (upsertError) {
      console.error("Error upserting insights:", upsertError);
      return { insights: null, regenerated: false, error: upsertError.message };
    }

    revalidatePath("/dashboard");

    return { insights: upserted, regenerated: true, error: null };
  } catch (err) {
    console.error("regenerateInsights error:", err);
    return { insights: null, regenerated: false, error: "Failed to regenerate insights" };
  }
}

export async function invalidateInsightsCache() {
  revalidatePath("/dashboard");
}
