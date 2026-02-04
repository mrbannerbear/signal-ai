"use client";

import { useState } from "react";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { Job } from "@/schemas/jobs.schema";

interface JobDetailsProps {
  job: Job;
}

export default function JobDetails({ job }: JobDetailsProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="space-y-6">
      {/* Company Info Section */}
      {job.company_description && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            About {job.company}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {job.company_description}
          </p>
        </div>
      )}

      {/* Job Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Description */}
        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">About the Role</h2>
          <div
            className={`text-sm leading-relaxed text-muted-foreground ${
              !showFullDescription &&
              job.description &&
              job.description.length > 500
                ? "line-clamp-6"
                : ""
            }`}
          >
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>
          {job.description && job.description.length > 500 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {showFullDescription ? (
                <>
                  Show less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Responsibilities */}
        {job.responsibilities && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Responsibilities</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {job.responsibilities}
            </p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Requirements</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {job.requirements}
            </p>
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {job.other_benefits && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Benefits & Perks</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {job.other_benefits}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
