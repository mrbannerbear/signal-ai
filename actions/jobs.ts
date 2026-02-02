"use server";

import { createClient } from "@/app/lib/supabase/server";
import { Job, jobSchema } from "@/schemas/jobs.schema";

export type ActionResponse = {
  success: boolean;
  message?: string;
  id?: string;
  errors?: Record<string, string[]>;
};

export const createJob = async (values: Job): Promise<ActionResponse> => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const validation = jobSchema.safeParse(values);
  if (!validation.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validation.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const valuesToInsert = validation.data;

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      user_id: user.id,
      ...valuesToInsert,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message || "Failed to create job",
    };
  }

  return {
    success: true,
    message: "Job created successfully",
    id: data.id,
  };
};

export const getAllJobs = async (page: number = 1, pageSize: number = 9) => {
  const supabase = await createClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    jobs: data as Job[] || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
};

export const getJobById = async (id: string) => {
  const supabase = await createClient();

  // Fetch Job and Profile in parallel
  const [jobRes, profileRes] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", id).single(),
    supabase.from("profiles").select("*").single(), // Assuming one profile per user
  ]);

  if (jobRes.error || !jobRes.data) throw new Error(
    "Error fetching job."
  );

  return {
    job: jobRes.data,
    profile: profileRes.data,
  };
};
