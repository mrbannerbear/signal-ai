import crypto from "crypto";
import type { AnalysisSummaryData } from "./types";

/**
 * Compute an MD5 hash of all analysis summaries to detect changes.
 */
export function computeAnalysisHash(analyses: AnalysisSummaryData[]): string {
  const content = analyses
    .map(
      (a) =>
        `${a.job_id}:${a.analysis_summary || ""}:${a.overall_fit_score || 0}`
    )
    .sort()
    .join("|");
  return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * Deduplicate and cap an array of strings.
 */
export function deduplicateAndCap(
  items: string[],
  limit: number = 10
): string[] {
  return [...new Set(items)].slice(0, limit);
}

/**
 * Calculate average from a list of nullable numbers,
 * returning null when there are no valid values.
 */
export function safeAverage(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

/**
 * Build a prompt string from analyses for AI summary generation.
 */
export function buildInsightsSummaryPrompt(
  analyses: AnalysisSummaryData[]
): string | null {
  const summaries = analyses
    .filter((a) => a.analysis_summary)
    .map(
      (a) =>
        `Job: ${a.job_title} at ${a.company}\nFit: ${a.overall_fit_label || "N/A"} (${a.overall_fit_score || "N/A"}%)\nSummary: ${a.analysis_summary}`
    )
    .join("\n\n");

  if (!summaries) return null;

  return `You are a career coach AI. Based on the following job fit analyses for a candidate, provide a concise 2-3 sentence overall career insight summary. Focus on patterns, key strengths, and areas for growth.

${summaries}

Provide only the summary text, no headers or formatting.`;
}
