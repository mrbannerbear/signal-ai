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
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  console.log("layout profile check", profile);
  console.log("user id", user.id);
  if (!profile) {
    redirect("/dashboard/profile?editing=new");
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
