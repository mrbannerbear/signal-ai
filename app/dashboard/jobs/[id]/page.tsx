import { createClient } from "@/app/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Job } from "@/schemas/jobs.schema";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Globe,
  Clock,
  ArrowUpRight,
  Building2,
  Sparkles,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function JobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { id } = await params;
  const { mode } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single<Job>();

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-0 md:px-4 animate-in fade-in duration-500 pb-10">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium px-4 md:px-0">
        <Link
          href="/dashboard/jobs"
          className="hover:text-indigo-600 transition-colors"
        >
          Jobs
        </Link>
        <span>/</span>
        <span className="text-slate-900">{job.title}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-start gap-6">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight leading-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 text-xl text-slate-600 font-medium">
                <Building2 className="w-5 h-5 text-indigo-500" />
                {job.company}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center text-sm text-slate-500 font-medium">
              {/* Employment Type */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                <Briefcase size={14} />
                {job.employment_type}
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <MapPin size={14} />
                {job.location}
              </div>

              {/* Salary */}
              {job.compensation && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  <DollarSign size={14} />
                  {job.compensation}
                </div>
              )}

              {/* Experience */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <Clock size={14} />
                {job.experience_level}
              </div>

              {/* External Link */}
              <a
                href="#"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100 transition-colors"
              >
                <Globe size={14} />
                Visit Website <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 xl:pt-2">
            <Link href={`/dashboard/jobs/${job.id}?mode=analysis+new`}>
              <Button
                variant={mode === "analysis new" ? "secondary" : "default"}
                size="sm"
                className={`w-full sm:w-auto rounded-full gap-2 font-semibold transition-colors ${
                  mode === "analysis new"
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                }`}
              >
                <Sparkles size={14} />
                <span className="md:inline">Compare With Your Profile</span>
              </Button>
            </Link>
            <Link href={`/dashboard/jobs/${job.id}?mode=analysis+saved`}>
              <Button
                variant={mode === "analysis saved" ? "secondary" : "outline"}
                size="sm"
                className={`w-full sm:w-auto rounded-full gap-2 font-semibold transition-colors ${
                  mode === "analysis saved"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                    : "border-slate-200 hover:bg-slate-50 hover:text-indigo-600 bg-white/80 backdrop-blur-sm md:bg-white"
                }`}
              >
                <FileText size={14} />
                <span className="md:inline">View Analysis</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-16 -mt-16 z-0 opacity-50 pointer-events-none" />
      </div>

      {/* Description Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-1 rounded-full bg-indigo-500" />
          The Role
        </h3>
        <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>
      </div>

      {/* Requirements Card */}
      {job.requirements && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-1 rounded-full bg-emerald-500" />
            Requirements
          </h3>
          <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
            {job.requirements}
          </div>
        </div>
      )}
    </div>
  );
}
