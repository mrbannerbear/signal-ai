import type { AnalysisSummaryData } from "./types";

export function mapToAnalysisSummary(
  row: Record<string, unknown>
): AnalysisSummaryData {
  const jobs = row.jobs as Record<string, unknown> | null;

  return {
    job_id: row.job_id as string,
    job_title: (jobs?.title as string) || "Unknown",
    company: (jobs?.company as string) || "Unknown",
    analysis_summary: (row.analysis_summary as string) || null,
    overall_fit_score: (row.overall_fit_score as number) || null,
    overall_fit_label: (row.overall_fit_label as string) || null,
    risk_level: (row.risk_level as AnalysisSummaryData["risk_level"]) || null,
    top_strengths: (row.top_strengths as string[]) || null,
    top_weaknesses: (row.top_weaknesses as string[]) || null,
  };
}
