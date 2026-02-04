import "dotenv/config";
import { performLLMAnalysis } from "@/actions/analysis";
import { createServiceClient } from "@/app/lib/supabase/service";
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
export async function runAnalysisWorker(): Promise<boolean> {
  const supabase = createServiceClient();

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
      return false; // No work found
    }

    console.log(`[Worker] Processing run ${run.id}`);
    let sectionFailed = false;

    for (const section of sections) {
      console.log(`[Worker] Starting section: ${section}`);
      try {
        console.log(`[Worker] Starting section: ${section}`);
        const resultContent = await performLLMAnalysis(
          run.job_id,
          run.profile_id,
          section,
          supabase,
        );
        console.log(`[Worker] Completed section: ${section}`);

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

        if (insertError) {
          console.error(`[Worker] Insert error for ${section}:`, insertError);
          throw insertError;
        }
        console.log(`[Worker] Saved section: ${section}`);
      } catch (sectionError) {
        console.error(
          `Section failed ${section} for run ${run.id}:`,
          sectionError,
        );
        sectionFailed = true;
      }
    }

    console.log(`[Worker] All sections done, updating status to ${sectionFailed ? "failed" : "completed"}`);
    const finalStatus = sectionFailed ? "failed" : "completed";
    const { error: updateError } = await supabase
      .from("analysis_run")
      .update({
        status: finalStatus,
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id);

    if (updateError) console.error("Error updating run status:", updateError);

    return true; // Work was done
  } catch (err) {
    console.error("Worker error:", err);
    return false;
  }
}

if (process.env.NODE_ENV !== "production") {
  (async () => {
    while (true) {
      await runAnalysisWorker();
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
    }
  })();
}