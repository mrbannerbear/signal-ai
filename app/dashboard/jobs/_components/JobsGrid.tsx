"use client";

import Link from "next/link";
import { JobCard } from "./JobCard";
import { Job } from "@/schemas/jobs.schema";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const JobsGrid = ({
  jobs,
  isAnalysis,
}: {
  jobs: Job[];
  isAnalysis?: boolean;
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const router = useRouter();

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId),
    [jobs, selectedJobId],
  );

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="mb-4 text-zinc-500">No jobs found.</p>
        <Link href="/dashboard/jobs/new">
          <Button className="rounded-xl font-bold shadow-lg shadow-zinc-200/50 bg-zinc-900 hover:bg-zinc-800 text-white">
            Post a New Job
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <div key={job.id}>
          {!isAnalysis ? (
            <Link href={`/dashboard/jobs/${job.id}`}>
              <JobCard job={job} isAnalysis={false} />
            </Link>
          ) : (
            <JobCard
              job={job}
              isAnalysis={true}
              selectedJobId={selectedJobId}
              setSelectedJobId={setSelectedJobId}
            />
          )}
        </div>
      ))}

      {isAnalysis && selectedJobId && (
        <div className="col-span-full mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button 
          onClick={() => {
            sessionStorage.setItem("analysisMode", "true");
            router.push(`/dashboard/jobs/${selectedJobId}`)
          }}
          className="w-full rounded-xl font-bold px-8 py-6 shadow-lg shadow-zinc-200/50 bg-zinc-900 hover:bg-zinc-800 text-white transition-all transform hover:scale-105 active:scale-95">
            Compare With Your Profile
          </Button>

          {selectedJob?.is_analyzed ? (
            <Link
              href={`/dashboard/jobs/${selectedJobId}?mode=analysis+saved`}
              className="w-full sm:w-auto"
            >
              <Button className="w-full rounded-xl font-bold px-8 py-6 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white transition-all transform hover:scale-105 active:scale-95">
                View Analysis
              </Button>
            </Link>
          ) : (
            <Button
              disabled
              className="w-full sm:w-auto rounded-xl font-bold px-8 py-6 bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200"
            >
              View Analysis
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsGrid;
