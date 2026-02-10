import { createClient } from "@/app/lib/supabase/server";
import getUserOnServer from "@/utils/getUserOnServer";
import {
  getUserInsights,
  getAllUserAnalyses,
  regenerateInsights,
} from "@/actions/insights";
import DashboardClient from "./_components/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await getUserOnServer();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/dashboard/profile?editing=new");
  }

  // Get insights (cached)
  const { insights, error: insightsError } = await getUserInsights();

  // Get all analyses for the grid
  const { analyses, error: analysesError } = await getAllUserAnalyses();

  // If no cached insights but we have analyses, try to regenerate
  let finalInsights = insights;
  if (!insights && analyses.length > 0) {
    const { insights: regenerated } = await regenerateInsights();
    finalInsights = regenerated;
  }

  return (
    <DashboardClient
      userName={profile?.first_name}
      insights={finalInsights}
      analyses={analyses}
      insightsError={insightsError}
      analysesError={analysesError}
    />
  );
}
