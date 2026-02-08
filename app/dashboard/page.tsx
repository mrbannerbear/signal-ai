import { createClient } from "@/app/lib/supabase/server";
import getUserOnServer from "@/utils/getUserOnServer";
import { getUserInsights, getAllUserAnalyses, regenerateInsights } from "@/actions/insights";
import DashboardClient from "./_components/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = await getUserOnServer();

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("firstName, lastName")
    .eq("user_id", user.id)
    .maybeSingle();

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
      userName={profile?.firstName || "User"}
      insights={finalInsights}
      analyses={analyses}
      insightsError={insightsError}
      analysesError={analysesError}
    />
  );
}
