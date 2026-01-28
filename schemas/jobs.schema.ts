import z from "zod";

export const jobSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().min(5, "Title must be at least 5 characters long"),
  company: z.string().min(2, "Company name must be at least 2 characters long"),
  company_description: z.string().optional(),
  location: z.string().min(2, "Location must be at least 2 characters long"),
  employment_type: z
    .enum(["Full-time", "Part-time", "Contract", "Temporary", "Internship"])
    .optional(),
  experience_level: z
    .enum(["Entry", "Mid", "Senior", "Director", "Executive"])
    .optional(),
  compensation: z.string().optional(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters long"),
  responsibilities: z
    .string()
    .min(10, "Responsibilities must be at least 10 characters long"),
  requirements: z
    .string()
    .min(10, "Requirements must be at least 10 characters long"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  other_benefits: z.string().optional(),
  posted_date: z.string().optional(),
});

export type Job = z.infer<typeof jobSchema>;
