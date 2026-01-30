"use client";

import React from "react";
import { Profile } from "@/schemas/profiles.schema";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Globe,
  Linkedin,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface ProfileReadViewProps {
  profile: Profile;
  email?: string;
}

export const ProfileReadView = ({ profile, email }: ProfileReadViewProps) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 z-20">
          <Link href="/dashboard/profile?editing=true">
            <Button
              variant="outline"
              className="rounded-full gap-2 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              <Edit2 size={14} />
              <span className="font-semibold">Edit Profile</span>
            </Button>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            {profile.firstName} {profile.lastName}
          </h1>
          {profile.headline && (
            <p className="text-xl text-slate-600 font-medium mb-6 max-w-2xl leading-relaxed">
              {profile.headline}
            </p>
          )}

          <div className="flex flex-wrap gap-4 items-center text-sm text-slate-500 font-medium">
            {profile.location && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <MapPin size={14} />
                {profile.location}
              </div>
            )}
            {email && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <Mail size={14} />
                {email}
              </div>
            )}
            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                <Globe size={14} />
                Portfolio
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                <Linkedin size={14} />
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-16 -mt-16 z-0 opacity-50" />
      </div>

      {/* About Me */}
      {profile.bio && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-1 rounded-full bg-indigo-500" />
            About Me
          </h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Briefcase className="text-indigo-600" size={24} />
            Experience
          </h3>

          <div className="space-y-10">
            {profile.experience.map((exp, i) => (
              <div
                key={i}
                className="relative pl-8 border-l-2 border-slate-100 last:border-0 ml-2"
              >
                <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-100" />
                {/* Inner content */}
                <div className="-mt-1.5">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2 gap-1">
                    <h4 className="text-xl font-bold text-slate-900">
                      {exp.role}
                    </h4>
                    <span className="text-sm font-mono text-slate-500 bg-slate-50 px-3 py-1 rounded-md border border-slate-100 w-fit">
                      {new Date(exp.startDate).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -
                      {exp.isCurrent
                        ? " Present"
                        : ` ${new Date(exp.endDate!).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`}
                    </span>
                  </div>
                  <p className="text-indigo-600 font-bold text-lg mb-4">
                    {exp.companyName}
                  </p>
                  {exp.description && (
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-1 rounded-full bg-emerald-500" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white text-slate-700 rounded-xl text-sm font-bold border border-slate-200 shadow-sm"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
            <GraduationCap className="text-emerald-600" size={24} />
            Education
          </h3>

          <div className="gap-6">
            {profile.education.map((edu, i) => (
              <div
                key={i}
                className="flex gap-4 items-start p-6 rounded-2xl bg-slate-50 border border-slate-100 w-full"
              >
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-emerald-600">
                  <Award size={24} />
                </div>
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">
                      {edu.institution}
                    </h4>
                    <p className="text-slate-600 font-medium">{edu.degree}</p>
                  </div>
                  <p className="text-sm text-slate-400 mt-2 font-mono">
                    {edu.startDate && new Date(edu.startDate).getFullYear()} -{" "}
                    {edu.graduationDate &&
                      new Date(edu.graduationDate).getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
