"use server";
import { createClient } from "@/app/lib/supabase/server";

export default async function getUserOnServer(throwError = true) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if ((authError || !user) && throwError) {
    throw new Error("User not authenticated");
  } else if (authError || !user) {
    return null;
  }
  return user;
}
