import { performLLMAnalysis } from "@/actions/compare";
import { createClient } from "@/app/lib/supabase/server";
import { AnalysisSection } from "@/schemas/analysis.schema";

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
export async function runAnalysisWorker() {
  const supabase = await createClient();

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
      return;
    }

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
          .upsert(
            {
              analysis_run_id: run.id,
              section,
              content: resultContent,
            },
            { onConflict: "analysis_run_id,section" },
          );

        if (insertError) throw insertError;
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
  } catch (err) {
    console.error("Worker error:", err);
  }

  await new Promise((r) => setTimeout(r, POLL_INTERVAL));
}

if (process.env.NODE_ENV === "development") {
  (async () => {
    while (true) {
      await runAnalysisWorker();
      await new Promise((r) => setTimeout(r, 5000));
    }
  })();
}
