import DashboardLayout from "@/components/shared/DashboardLayout";

import React from "react";
import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Check if this specific user has a profile record
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/profile");
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
