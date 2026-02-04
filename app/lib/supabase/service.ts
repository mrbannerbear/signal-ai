import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service client for background jobs (no cookies needed)
// Uses service role key which bypasses RLS
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables",
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
}
