"use client";

import { analyzeJob } from "@/actions/analysis";
import { getExistingAnalysis } from "@/actions/getAnalysis";
import { Button } from "@/components/ui/button";
import { Job } from "@/schemas/jobs.schema";
import { Profile } from "@/schemas/profiles.schema";
import { FileText, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const JobDetailActionButtons = ({
  job,
  profile,
}: {
  job: Job;
  profile: Profile;
  analysisRunId: string | null;
  setAnalysisRunId: (id: string | null) => void;
}) => {
  const [processStarted, setProcessStarted] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("analysisMode") === "true";
  });

  const autoStartOnceRef = useRef(false);

  useEffect(() => {
    if (!processStarted) return;
    if (autoStartOnceRef.current) return;

    autoStartOnceRef.current = true;
    sessionStorage.removeItem("analysisMode");

    (async () => {
      try {
        await analyzeJob(job.id as string, profile.id as string);
      } catch (error) {
        console.error("Error starting analysis process", error);
        setProcessStarted(false);
      }
    })();
  }, [processStarted, job.id, profile.id]);

  const handleAnalysisClick = async () => {
    if (processStarted) return;

    setProcessStarted(true);
    sessionStorage.removeItem("analysisMode");

    try {
      await analyzeJob(job.id as string, profile.id as string);
    } catch (error) {
      console.error("Error starting analysis process", error);
      setProcessStarted(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 shrink-0 xl:pt-2">
      <Button
        onClick={handleAnalysisClick}
        variant="default"
        size="sm"
        className={`w-full sm:w-auto rounded-full gap-2 font-semibold transition-colors ${"bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"}`}
      >
        <Sparkles size={14} />
        <span className="md:inline">Compare With Your Profile</span>
      </Button>

        <Button
        onClick={
          async () => {
            try {
              await getExistingAnalysis(job.id as string, profile.id as string);
            }
            catch {
              console.error("Error viewing analysis");
            }
          }
        }
          variant="outline"
          size="sm"
          className={`w-full sm:w-auto rounded-full gap-2 font-semibold transition-colors ${"border-slate-200 hover:bg-slate-50 hover:text-indigo-600 bg-white/80 backdrop-blur-sm md:bg-white"}`}
        >
          <FileText size={14} />
          <span className="md:inline">View Analysis</span>
        </Button>
    </div>
  );
};

export default JobDetailActionButtons;