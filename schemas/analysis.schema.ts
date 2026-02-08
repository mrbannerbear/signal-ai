import { z } from "zod";
import { jobAnalysisOutputSchema } from "./job-analysis.schema";

export const analysisSchema = z.object({
  id: z.uuid(),
  job_id: z.uuid(),
  profile_id: z.uuid(),
  content: jobAnalysisOutputSchema,
  analysis_summary: z.string().nullable(),
  overall_fit_score: z.number().min(0).max(100).nullable(),
  overall_fit_label: z.string().nullable(),
  risk_level: z.enum(["low", "medium", "high"]).nullable(),
  confidence: z.number().min(0).max(100).nullable(),
  dimension_scores: z.record(z.string(), z.number()).nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export type Analysis = z.infer<typeof analysisSchema>;
