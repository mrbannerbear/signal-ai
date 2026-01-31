import { z } from "zod";

export const ResumeProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string(),
  bio: z.string(),
  location: z.string(),
  portfolioUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      bullets: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ),
});

export type ResumeProfile = z.infer<typeof ResumeProfileSchema>;