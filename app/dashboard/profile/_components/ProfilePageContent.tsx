"use client";

import React, { useState } from "react";
import { ResumeProfile } from "@/schemas/resume.schema";
import { Profile } from "@/schemas/profiles.schema";
import ResumeParser from "./ResumeParser";
import { ProfileForm } from "./ProfileForm";

interface ProfilePageContentProps {
  initialProfile?: Profile;
}

export const ProfilePageContent = ({
  initialProfile,
}: ProfilePageContentProps) => {
  const [importedResumeData, setImportedResumeData] =
    useState<ResumeProfile | null>(null);

  const handleResumeApply = (data: ResumeProfile) => {
    setImportedResumeData({...data});
  };

  return (
    <div className="space-y-8">
      <ResumeParser onApply={handleResumeApply} />
      <ProfileForm 
        initialData={initialProfile} 
        importedData={importedResumeData}
      />
    </div>
  );
};
