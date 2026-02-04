"use client";

import {
  Loader2,
  MapPin,
  Building2,
  Briefcase,
  Clock,
  DollarSign,
  GitCompare,
  FileText,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";

interface JobHeaderProps {
  job: Job;
  profile: Profile | null;
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  showAnalysis: boolean;
  onCompare: () => void;
  onToggleAnalysis: () => void;
  onEdit: () => void;
  onBackToJob: () => void;
}

export default function JobHeader({
  job,
  profile,
  isAnalyzing,
  hasAnalysis,
  showAnalysis,
  onCompare,
  onToggleAnalysis,
  onEdit,
  onBackToJob,
}: JobHeaderProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-lg text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            {job.employment_type && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{job.employment_type}</span>
              </div>
            )}
            {job.experience_level && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.experience_level} Level</span>
              </div>
            )}
            {job.compensation && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{job.compensation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {showAnalysis ? (
            <button
              onClick={onBackToJob}
              className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Job
            </button>
          ) : (
            <>
              <button
                onClick={onCompare}
                disabled={isAnalyzing}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GitCompare className="h-4 w-4" />
                )}
                {isAnalyzing ? "Analyzing..." : profile ? "Compare" : "Analyze"}
              </button>

              <button
                onClick={onEdit}
                className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            </>
          )}

          <button
            onClick={onToggleAnalysis}
            disabled={!hasAnalysis}
            className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            {showAnalysis ? "Hide Analysis" : "See Analysis"}
          </button>
        </div>
      </div>
    </div>
  );
}
