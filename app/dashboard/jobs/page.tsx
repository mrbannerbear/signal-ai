import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getAllJobs } from "@/actions/jobs";
import { cn } from "@/app/lib/utils";
import JobsGrid from "./_components/JobsGrid";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; analysis?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const isAnalysis = params.analysis === "true";
  const { jobs, totalPages, totalCount } = await getAllJobs(currentPage);

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            {isAnalysis ? "Analysis Mode" : "Saved Jobs"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAnalysis
              ? "Select a job to compare against your profile"
              : `Managing ${totalCount} saved opportunities`}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           {/* Segmented Control */}
           <div className="flex bg-muted p-1 rounded-lg border border-border/40 shadow-sm w-full sm:w-auto">
             <Link
                href="/dashboard/jobs"
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none text-center",
                  !isAnalysis
                    ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
             >
               Saved Jobs
             </Link>
             <Link
                href="/dashboard/jobs?analysis=true"
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex-1 sm:flex-none text-center",
                  isAnalysis
                    ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                Analysis
              </Link>
           </div>

          {!isAnalysis && (
            <Button
              asChild
              className="rounded-xl font-bold shadow-sm bg-zinc-900 hover:bg-zinc-800 text-white w-full sm:w-auto"
            >
              <Link href="/dashboard/jobs/new">
                <Plus className="w-4 h-4 mr-2" /> New Job
              </Link>
            </Button>
          )}
        </div>
      </div>

      <JobsGrid jobs={jobs} isAnalysis={isAnalysis} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
            className="rounded-full font-bold border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
          >
            {currentPage > 1 ? (
              <Link
                href={`/dashboard/jobs?page=${currentPage - 1}${isAnalysis ? "&analysis=true" : ""}`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Link>
            ) : (
              <span>Previous</span>
            )}
          </Button>

          <span className="text-sm font-bold font-mono tracking-widest bg-slate-100/50 text-slate-500 px-4 py-2 rounded-full border border-slate-100">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
            className="rounded-full font-bold border-slate-200 hover:bg-slate-50 hover:text-indigo-600"
          >
            {currentPage < totalPages ? (
              <Link
                href={`/dashboard/jobs?page=${currentPage + 1}${isAnalysis ? "&analysis=true" : ""}`}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            ) : (
              <span>Next</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
