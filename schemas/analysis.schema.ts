import { z } from "zod";

export const AnalysisStatusEnum = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
]);

export const AnalysisSectionEnum = z.enum([
  "summary",
  "skills",
  "gaps",
  "seniority",
  "location",
  "suggestions",
]);

export const AnalysisRunSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  profile_id: z.uuid().nullable(),
  job_id: z.uuid(),
  status: AnalysisStatusEnum,
  created_at: z.iso.datetime(),
  started_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable(),
});

export const AnalysisResultSchema = z.object({
  id: z.uuid(),
  analysis_run_id: z.uuid(),
  section: AnalysisSectionEnum,
  content: z.record(z.string(), z.any()),
  created_at: z.iso.datetime(),
});

export const CreateAnalysisRunSchema = z.object({
  job_id: z.uuid(),
  profile_id: z.uuid(),
});

export type AnalysisStatus = z.infer<typeof AnalysisStatusEnum>;
export type AnalysisSection = z.infer<typeof AnalysisSectionEnum>;
export type CreateAnalysisRunInput = z.infer<typeof CreateAnalysisRunSchema>;
export type AnalysisRun = z.infer<typeof AnalysisRunSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
