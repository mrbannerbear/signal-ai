import { z } from "zod";

export const ResumeProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  headline: z.string(),
  bio: z.string(),
  location: z.string(),
  portfolio_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      bullets: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    })
  ),
});

export type ResumeProfile = z.infer<typeof ResumeProfileSchema>;