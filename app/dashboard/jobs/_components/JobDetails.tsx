"use client";

import { useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  Send,
  Plus,
  X,
} from "lucide-react";
import { Job } from "@/schemas/jobs.schema";

interface JobDetailsProps {
  job: Job;
  isEditing?: boolean;
  editedJob?: Job;
  onFieldChange?: (field: keyof Job, value: string | string[] | boolean) => void;
}

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
] as const;

const EXPERIENCE_LEVELS = [
  "Entry",
  "Mid",
  "Senior",
  "Director",
  "Executive",
] as const;

export default function JobDetails({
  job,
  isEditing = false,
  editedJob,
  onFieldChange,
}: JobDetailsProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const currentJob = isEditing && editedJob ? editedJob : job;

  const handleAddSkill = () => {
    if (newSkill.trim() && onFieldChange) {
      const updatedSkills = [...(currentJob.skills || []), newSkill.trim()];
      onFieldChange("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    if (onFieldChange) {
      const updatedSkills = (currentJob.skills || []).filter((_, i) => i !== index);
      onFieldChange("skills", updatedSkills);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Section - Only shown in edit mode */}
      {isEditing && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Job Title *
              </label>
              <input
                type="text"
                value={currentJob.title || ""}
                onChange={(e) => onFieldChange?.("title", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Company *
              </label>
              <input
                type="text"
                value={currentJob.company || ""}
                onChange={(e) => onFieldChange?.("company", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Google"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" /> Location *
              </label>
              <input
                type="text"
                value={currentJob.location || ""}
                onChange={(e) => onFieldChange?.("location", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., San Francisco, CA or Remote"
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Briefcase className="h-4 w-4" /> Employment Type
              </label>
              <select
                value={currentJob.employment_type || ""}
                onChange={(e) => onFieldChange?.("employment_type", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select type</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" /> Experience Level
              </label>
              <select
                value={currentJob.experience_level || ""}
                onChange={(e) => onFieldChange?.("experience_level", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select level</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Compensation */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" /> Compensation
              </label>
              <input
                type="text"
                value={currentJob.compensation || ""}
                onChange={(e) => onFieldChange?.("compensation", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., $150,000 - $200,000"
              />
            </div>

            {/* Posted Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" /> Posted Date
              </label>
              <input
                type="date"
                value={currentJob.posted_date || ""}
                onChange={(e) => onFieldChange?.("posted_date", e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status Toggles */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentJob.is_analyzed || false}
                    onChange={(e) => onFieldChange?.("is_analyzed", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="flex items-center gap-1 text-sm">
                    <CheckCircle className="h-4 w-4" /> Analyzed
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentJob.has_applied || false}
                    onChange={(e) => onFieldChange?.("has_applied", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className="flex items-center gap-1 text-sm">
                    <Send className="h-4 w-4" /> Applied
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Info Section */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          About {currentJob.company}
        </h2>
        {isEditing ? (
          <textarea
            value={currentJob.company_description || ""}
            onChange={(e) => onFieldChange?.("company_description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe the company..."
          />
        ) : currentJob.company_description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {currentJob.company_description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground/60">
            No company description provided
          </p>
        )}
      </div>

      {/* Job Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Description */}
        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">About the Role *</h2>
          {isEditing ? (
            <textarea
              value={currentJob.description || ""}
              onChange={(e) => onFieldChange?.("description", e.target.value)}
              rows={8}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe the role in detail..."
            />
          ) : (
            <>
              <div
                className={`text-sm leading-relaxed text-muted-foreground ${
                  !showFullDescription &&
                  currentJob.description &&
                  currentJob.description.length > 500
                    ? "line-clamp-6"
                    : ""
                }`}
              >
                <p className="whitespace-pre-wrap">{currentJob.description}</p>
              </div>
              {currentJob.description && currentJob.description.length > 500 && (
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
            </>
          )}
        </div>

        {/* Responsibilities */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Responsibilities *</h2>
          {isEditing ? (
            <textarea
              value={currentJob.responsibilities || ""}
              onChange={(e) => onFieldChange?.("responsibilities", e.target.value)}
              rows={6}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="List the key responsibilities..."
            />
          ) : currentJob.responsibilities ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {currentJob.responsibilities}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground/60">
              No responsibilities listed
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Requirements *</h2>
          {isEditing ? (
            <textarea
              value={currentJob.requirements || ""}
              onChange={(e) => onFieldChange?.("requirements", e.target.value)}
              rows={6}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="List the requirements..."
            />
          ) : currentJob.requirements ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {currentJob.requirements}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground/60">
              No requirements listed
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Required Skills *</h2>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {(currentJob.skills || []).map((skill, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(i)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add a skill..."
                />
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>
          ) : currentJob.skills && currentJob.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentJob.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground/60">
              No skills listed
            </p>
          )}
        </div>

        {/* Benefits */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Benefits & Perks</h2>
          {isEditing ? (
            <textarea
              value={currentJob.other_benefits || ""}
              onChange={(e) => onFieldChange?.("other_benefits", e.target.value)}
              rows={6}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="List benefits and perks..."
            />
          ) : currentJob.other_benefits ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {currentJob.other_benefits}
            </p>
          ) : (
            <p className="text-sm italic text-muted-foreground/60">
              No benefits listed
            </p>
          )}
        </div>
      </div>

      {/* Additional Info - Read Only */}
      {!isEditing && (currentJob.posted_date || currentJob.is_analyzed || currentJob.has_applied) && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Additional Info</h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {currentJob.posted_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Posted: {new Date(currentJob.posted_date).toLocaleDateString()}</span>
              </div>
            )}
            {currentJob.is_analyzed && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Analyzed</span>
              </div>
            )}
            {currentJob.has_applied && (
              <div className="flex items-center gap-1 text-blue-600">
                <Send className="h-4 w-4" />
                <span>Applied</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
