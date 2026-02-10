import { z } from "zod";

export const experienceSchema = z.object({
  id: z.uuid().optional(),
  company_name: z.string().min(2, "Company name is required"),
  role: z.string().min(2, "Job title/role is required"),
  location: z.string().optional().nullable(),
  start_date: z.coerce.date({
    error: (issue) => (issue.input === undefined ? "Required" : "Invalid date"),
  }),
  end_date: z.coerce.date().optional().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
  position: z.number().int().default(0),
});

export const educationSchema = z.object({
  id: z.uuid().optional(),
  institution: z.string().min(2, "Institution name is required"),
  degree: z.string().optional().or(z.literal("")),
  start_date: z.coerce.date().optional().nullable(),
  end_date: z.coerce.date().optional().nullable(),
  position: z.number().int().default(0),
});

export const profileSchema = z.object({
  id: z.uuid().optional().or(z.literal("")),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  headline: z
    .string()
    .min(5, "A professional headline is highly recommended")
    .max(100),
  bio: z.string().min(20, "A short bio helps AI matching").max(2000),

  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z
          .enum(["Beginner", "Intermediate", "Advanced", "Expert"])
          .optional(),
      }),
    )
    .min(1, "Add at least one skill to your profile"),

  location: z.string().optional().or(z.literal("")),
  portfolio_url: z.url("Invalid portfolio URL").optional().or(z.literal("")),
  linkedin_url: z.url("Invalid LinkedIn URL").optional().or(z.literal("")),

  // Relational Arrays (for bulk updates or initial data fetching)
  experience: z.array(experienceSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
});

export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Profile = z.infer<typeof profileSchema>;
