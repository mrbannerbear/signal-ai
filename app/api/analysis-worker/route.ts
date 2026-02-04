import { runAnalysisWorker } from "@/worker/runAnalysisWorker";

export const maxDuration = 60; // Allow up to 60s on Vercel

export async function GET() {
  let processed = 0;
  const maxJobs = 10;

  while (processed < maxJobs) {
    await runAnalysisWorker();
    processed++;
  }

  return new Response(`Processed ${processed} jobs`);
}