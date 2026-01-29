import { z } from "zod";

export const ResumeProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string(),
  bio: z.string(),
  location: z.string(),
  portfolioUrl: z.string(),
  linkedinUrl: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      summary: z.string(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      startDate: z.string(),
      endDate: z.string(),
    })
  ),
});

export type ResumeProfile = z.infer<typeof ResumeProfileSchema>;