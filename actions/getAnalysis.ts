"use server";

import { createClient } from "@/app/lib/supabase/server";

export async function getExistingAnalysis(jobId: string, profileId: string | null) {
  const supabase = await createClient();

  const query = supabase
    .from("analysis")
    .select("*")
    .eq("job_id", jobId);

  if (profileId) {
    query.eq("profile_id", profileId);
  } else {
    query.is("profile_id", null);
  }

  const { data, error } = await query.single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching analysis:", error);
  }

  return data?.content || null;
}
