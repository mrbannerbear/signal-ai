import { createClient } from "@/app/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Job } from "@/schemas/jobs.schema";
import Link from "next/link";
import { Profile } from "@/schemas/profiles.schema";
import getUserOnServer from "@/utils/getUserOnServer";
import JobDetailClient from "../_components/JobDetailClient";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getUserOnServer();

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single<Job>();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single<Profile>();

  const { data: existingAnalysis } = await supabase
    .from("analysis")
    .select("*")
    .eq("job_id", id)
    .eq("profile_id", profile?.id)
    .single();

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
        <Link href="/dashboard/jobs">
          <Button variant="outline">Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return <JobDetailClient job={job} profile={profile} existingAnalysis={existingAnalysis} />;
}
