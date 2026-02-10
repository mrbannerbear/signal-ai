"use server";
import { createClient } from "@/app/lib/supabase/server";

export default async function getUserOnServer() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }
  return user;
}
