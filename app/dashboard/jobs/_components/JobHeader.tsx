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
  Trash2,
  Save,
  X,
} from "lucide-react";
import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";

interface JobHeaderProps {
  job: Job;
  profile: Profile | null;
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  showAnalysis: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  onCompare: () => void;
  onToggleAnalysis: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onBackToJob: () => void;
}

export default function JobHeader({
  job,
  isAnalyzing,
  hasAnalysis,
  showAnalysis,
  isEditing,
  isSaving,
  isDeleting,
  onCompare,
  onToggleAnalysis,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  onBackToJob,
}: JobHeaderProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-card p-6 shadow-xs">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{job.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-lg text-emerald-600 font-medium">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 font-medium">
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
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 shadow-sm"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={onCancelEdit}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          ) : showAnalysis ? (
            <button
              onClick={onBackToJob}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Job
            </button>
          ) : (
            <>
              <button
                onClick={onCompare}
                disabled={isAnalyzing}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 shadow-sm"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <GitCompare className="h-4 w-4" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </button>

              <button
                onClick={onEdit}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            </>
          )}

          {!isEditing && (
            <button
              onClick={onToggleAnalysis}
              disabled={!hasAnalysis}
              className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              {showAnalysis ? "Hide Analysis" : "See Analysis"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
