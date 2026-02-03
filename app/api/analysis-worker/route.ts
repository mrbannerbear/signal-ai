import { runAnalysisWorker } from "@/worker/runAnalysisWorker";

export async function GET() {
  await runAnalysisWorker();
  return new Response("ok");
}
