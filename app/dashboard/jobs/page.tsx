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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-3xl font-black tracking-tight text-slate-900">
            {isAnalysis ? "Analysis" : "Saved Jobs"}
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {isAnalysis
              ? "Click to Compare Profile"
              : `Managing ${totalCount} saved opportunities`}
          </p>
        </div>
        <div className="flex gap-2">
          {!isAnalysis && (
            <Button
              asChild
              className="rounded-full font-bold shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700"
            >
              <Link href="/dashboard/jobs/new">
                <Plus className="w-4 h-4 mr-2" /> New Job
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className={cn(
              "rounded-full font-bold border-slate-200",
              isAnalysis
                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                : "text-slate-600",
            )}
          >
            <Link
              href={
                isAnalysis ? "/dashboard/jobs" : "/dashboard/jobs?analysis=true"
              }
            >
              {isAnalysis ? "View All Jobs" : "Analysis Mode"}
            </Link>
          </Button>
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
