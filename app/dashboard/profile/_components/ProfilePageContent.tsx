"use client";

import { useState } from "react";
import { ResumeProfile } from "@/schemas/resume.schema";
import { Profile } from "@/schemas/profiles.schema";
import ResumeParser from "./ResumeParser";
import { ProfileForm } from "./ProfileForm";

interface ProfilePageContentProps {
  initialProfile?: Profile;
}

import { useSearchParams, useRouter } from "next/navigation";
import { ProfileReadView } from "./ProfileReadView";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProfilePageContentProps {
  initialProfile?: Profile;
  email?: string;
}

export const ProfilePageContent = ({
  initialProfile,
  email,
}: ProfilePageContentProps) => {
  const [importedResumeData, setImportedResumeData] =
    useState<ResumeProfile | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const isEditing = searchParams.get("editing") === "true" || searchParams.get("editing") === "new";
  const isFirstTime = searchParams.get("editing") === "new";

  const handleResumeApply = (data: ResumeProfile) => {
    setImportedResumeData({...data});
  };

  const handleCancel = () => {
    if (!isFirstTime) {
       router.push("/dashboard/profile");
    }
  };

  if (!isEditing && initialProfile?.firstName) {
    return <ProfileReadView profile={initialProfile} email={email} />;
  }

  // Edit Mode View
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Edit Mode Header */}
      <div className="flex flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            {isFirstTime ? "Let's Build Your Profile" : "Edit Profile"}
          </h1>
          <p className="text-slate-500 mt-2">
            {isFirstTime 
              ? "Import your resume to get started instantly, or fill it out manually." 
              : "Update your details or import a new resume to refresh your data."}
          </p>
        </div>
        {!isFirstTime && (
          <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full">
            <X size={24} className="text-slate-400 hover:text-slate-700" />
          </Button>
        )}
      </div>

      <div className="space-y-10">
        
        {/* Resume Import Banner */}
        <ResumeParser onApply={handleResumeApply} compact={true} layout="row" />

        {/* Main Form Area */}
        <div className="max-w-4xl mx-auto">
           <ProfileForm 
             initialData={initialProfile} 
             importedData={importedResumeData}
             onCancel={handleCancel}
           />
        </div>
      </div>
    </div>
  );
};
