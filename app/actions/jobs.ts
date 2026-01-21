"use server";
import { createClient } from "../lib/supabase/server";
import { Job, jobSchema } from "../schemas/jobs.schema";

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
