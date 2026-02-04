"use client";

import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";
import { Briefcase, Building2, Clock, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";
import JobDetailActionButtons from "./JobDetailActionButtons";
import { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";

const POLL_INTERVAL = 5000; // 5s polling

const JobDetailClient = ({
  job,
  profile,
}: {
  job: Job;
  profile: Profile | null;
}) => {
  const [analysisRunId, setAnalysisRunId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>(
    {},
  );

  useEffect(() => {
    if (!analysisRunId) return;

    const supabase = createClient();
    let polling: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      try {
        // Always fetch status first
        const { data: run, error: runError } = await supabase
          .from("analysis_run")
          .select("status")
          .eq("id", analysisRunId)
          .single();

        if (runError) {
          console.error("Error fetching run status:", runError);
          return;
        }

        const status = run?.status;

        // Skip results if still queued
        if (status === "queued") return;

        // Fetch results if running or completed
        const { data: results, error } = await supabase
          .from("analysis_result")
          .select("*")
          .eq("analysis_run_id", analysisRunId);

        if (error) {
          console.error("Error fetching analysis results:", error);
          return;
        }

        if (results) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resultMap: Record<string, any> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          results.forEach((r: any) => {
            resultMap[r.section] = r.content;
          });
          console.log("Fetched analysis results:", resultMap);
          setAnalysisResults(resultMap);
        }

        // Stop polling when done
        if ((status === "completed" || status === "failed") && polling) {
          console.log("Run finished, stopping polling...");
          clearInterval(polling);
          polling = null;
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    poll();
    polling = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (polling) clearInterval(polling);
    };
  }, [analysisRunId]);

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
            </div>
          </div>
          {profile ? (
            <JobDetailActionButtons
              job={job}
              profile={profile}
              analysisRunId={analysisRunId}
              setAnalysisRunId={setAnalysisRunId}
            />
          ) : null}
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
};

export default JobDetailClient;
