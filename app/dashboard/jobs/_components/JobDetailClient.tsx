"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeJob } from "@/actions/analysis";
import { updateJob, deleteJob } from "@/actions/jobs";
import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";
import { JobAnalysisOutput } from "@/schemas/job-analysis.schema";
import JobHeader from "./JobHeader";
import JobDetails from "./JobDetails";
import AnalysisResults from "./AnalysisResults";
import AnalysisSkeleton from "./AnalysisSkeleton";

interface JobDetailClientProps {
  job: Job;
  profile: Profile | null;
  existingAnalysis?: JobAnalysisOutput;
}

export default function JobDetailClient({
  job,
  profile,
  existingAnalysis,
}: JobDetailClientProps) {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysisOutput | null>(
    existingAnalysis || null
  );

  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedJob, setEditedJob] = useState<Job>(job);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    setEditedJob(job);
    setIsEditing(true);
    setShowAnalysis(false);
  };

  const handleCancelEdit = () => {
    setEditedJob(job);
    setIsEditing(false);
    setError(null);
  };

  const handleFieldChange = (field: keyof Job, value: string | string[] | boolean) => {
    setEditedJob((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const result = await updateJob(job.id as string, editedJob);
      if (result.success) {
        setIsEditing(false);
        router.refresh();
      } else {
        setError(result.message || "Failed to save changes");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteJob(job.id as string);
      if (result.success) {
        router.push("/dashboard/jobs");
      } else {
        setError(result.message || "Failed to delete job");
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete job. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <JobHeader
        job={job}
        profile={profile}
        isAnalyzing={isAnalyzing}
        hasAnalysis={!!analysis}
        showAnalysis={showAnalysis}
        isEditing={isEditing}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onCompare={handleCompare}
        onToggleAnalysis={handleToggleAnalysis}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancelEdit={handleCancelEdit}
        onDelete={handleDelete}
        onBackToJob={handleBackToJob}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Delete Job</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete &quot;{job.title}&quot; at {job.company}? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Job"}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <JobDetails
            job={job}
            isEditing={isEditing}
            editedJob={editedJob}
            onFieldChange={handleFieldChange}
          />
        </div>

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