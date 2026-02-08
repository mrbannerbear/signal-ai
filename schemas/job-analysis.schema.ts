import { z } from "zod";

export const summarySchema = z.object({
  overview: z.string().min(10, "Overview must be at least 10 characters"),
  keyPoints: z.array(z.string()).min(1).max(7),
});

export const skillsSchema = z.object({
  required: z.array(z.string()),
  preferred: z.array(z.string()),
  matchingSkills: z.array(z.string()),
});

export const gapRecommendationSchema = z.object({
  skill: z.string(),
  action: z.string(),
  timeEstimate: z.string().optional(),
});

export const gapsSchema = z.object({
  missingSkills: z.array(z.string()),
  riskLevel: z.enum(["low", "medium", "high"]),
  recommendations: z.array(gapRecommendationSchema),
});

export const senioritySchema = z.object({
  level: z.enum(["junior", "mid", "senior", "lead", "executive"]),
  yearsExpected: z.string(),
  candidateFit: z.string(),
});

export const locationSchema = z.object({
  type: z.enum(["remote", "hybrid", "onsite"]),
  location: z.string(),
  relocationRequired: z.boolean(),
  candidateMatch: z.string(),
});

export const resumeEditSchema = z.object({
  targetSection: z.enum(["Experience", "Skills", "Summary"]),
  why: z.string(),
  exampleRewrite: z.string(),
});

export const interviewAngleSchema = z.object({
  topic: z.string(),
  whyTheyCare: z.string(),
  howToAnswer: z.string(),
});

export const redFlagSchema = z.object({
  risk: z.string(),
  mitigation: z.string(),
});

export const suggestionsSchema = z.object({
  resumeEdits: z.array(resumeEditSchema),
  interviewAngles: z.array(interviewAngleSchema),
  redFlags: z.array(redFlagSchema),
});

export const dimensionScoresSchema = z.object({
  skillsFit: z.number().min(0).max(100).optional(),
  experienceFit: z.number().min(0).max(100).optional(),
  seniorityFit: z.number().min(0).max(100).optional(),
  locationFit: z.number().min(0).max(100).optional(),
});

export const overallFitScoreSchema = z.object({
  score: z.number().min(0).max(100),
  explanation: z.string(),
  biggestStrengths: z.array(z.string()).min(1).max(5),
  improvementAreas: z.array(z.string()).min(0).max(5),
  label: z.enum(["Strong Match", "Good Fit", "Moderate Fit", "Weak Match", "Poor Fit"]),
  confidence: z.number().min(0).max(100),
  dimensionScores: dimensionScoresSchema,
});

export const jobAnalysisOutputSchema = z.object({
  analysisSummary: z.string().min(20).max(500),
  summary: summarySchema,
  skills: skillsSchema,
  gaps: gapsSchema,
  seniority: senioritySchema,
  location: locationSchema,
  suggestions: suggestionsSchema,
  overallFitScore: overallFitScoreSchema,
});

export type JobAnalysisOutput = z.infer<typeof jobAnalysisOutputSchema>;
export type Summary = z.infer<typeof summarySchema>;
export type Skills = z.infer<typeof skillsSchema>;
export type Gaps = z.infer<typeof gapsSchema>;
export type GapRecommendation = z.infer<typeof gapRecommendationSchema>;
export type Seniority = z.infer<typeof senioritySchema>;
export type Location = z.infer<typeof locationSchema>;
export type Suggestions = z.infer<typeof suggestionsSchema>;
export type ResumeEdit = z.infer<typeof resumeEditSchema>;
export type InterviewAngle = z.infer<typeof interviewAngleSchema>;
export type RedFlag = z.infer<typeof redFlagSchema>;
export type OverallFitScore = z.infer<typeof overallFitScoreSchema>;
export type DimensionScores = z.infer<typeof dimensionScoresSchema>;
