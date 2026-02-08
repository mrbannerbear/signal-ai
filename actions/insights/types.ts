export interface UserInsights {
  id: string;
  user_id: string;
  profile_id: string | null;
  overall_summary: string | null;
  aggregated_strengths: string[] | null;
  aggregated_weaknesses: string[] | null;
  average_fit_score: number | null;
  analysis_count: number;
  last_analysis_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalysisSummaryData {
  job_id: string;
  job_title: string;
  company: string;
  analysis_summary: string | null;
  overall_fit_score: number | null;
  overall_fit_label: string | null;
  risk_level: "low" | "medium" | "high" | null;
  top_strengths: string[] | null;
  top_weaknesses: string[] | null;
}
