"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeJob } from "@/actions/analysis";
import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";
import JobHeader from "./JobHeader";
import JobDetails from "./JobDetails";
import AnalysisResults from "./AnalysisResults";
import AnalysisSkeleton from "./AnalysisSkeleton";

interface JobDetailClientProps {
  job: Job;
  profile: Profile | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existingAnalysis?: any;
}

export default function JobDetailClient({
  job,
  profile,
  existingAnalysis,
}: JobDetailClientProps) {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysis, setAnalysis] = useState<any>(existingAnalysis || null);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleCompare = async () => {
    if (!profile) {
      router.push("/dashboard/profile");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setShowAnalysis(true);

    try {
      const result = await analyzeJob(job.id as string, profile.id as string);
      setAnalysis(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("Analysis failed. Please try again.");
      setShowAnalysis(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  const handleBackToJob = () => {
    setShowAnalysis(false);
  };

  const handleEdit = () => {
    router.push(`/dashboard/jobs/${job.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Header - Always visible */}
      <JobHeader
        job={job}
        profile={profile}
        isAnalyzing={isAnalyzing}
        hasAnalysis={!!analysis}
        showAnalysis={showAnalysis}
        onCompare={handleCompare}
        onToggleAnalysis={handleToggleAnalysis}
        onEdit={handleEdit}
        onBackToJob={handleBackToJob}
      />

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Content Area with Animation */}
      <div className="relative">
        {/* Job Details - Hidden when showing analysis */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showAnalysis
              ? "pointer-events-none absolute inset-0 -translate-x-5 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <JobDetails job={job} />
        </div>

        {/* Analysis Results - Shown when toggled */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showAnalysis
              ? "translate-x-0 opacity-100"
              : "pointer-events-none absolute inset-0 translate-x-5 opacity-0"
          }`}
        >
          {isAnalyzing ? (
            <AnalysisSkeleton />
          ) : (
            analysis && <AnalysisResults analysis={analysis} />
          )}
        </div>
      </div>
    </div>
  );
}