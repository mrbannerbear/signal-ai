/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getAllJobs } from "@/actions/jobs";
import { JobCard } from "./_components/JobCard";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const { jobs, totalPages, totalCount } = await getAllJobs(currentPage);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Active Signals</h1>
          <p className="text-muted-foreground text-sm font-medium">Managing {totalCount} saved opportunities</p>
        </div>
        <Button asChild className="rounded-full font-bold shadow-lg shadow-primary/20">
          <Link href="/dashboard/jobs/new"><Plus className="w-4 h-4 mr-2" /> New Job</Link>
        </Button>
      </div>

      {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job: { id: any; }) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-10">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
            className="rounded-xl font-bold"
          >
            {currentPage > 1 ? (
              <Link href={`/jobs?page=${currentPage - 1}`}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Link>
            ) : (
              <span>Previous</span>
            )}
          </Button>
          
          <span className="text-sm font-black font-mono tracking-widest bg-muted px-4 py-2 rounded-lg">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
            className="rounded-xl font-bold"
          >
            {currentPage < totalPages ? (
              <Link href={`/dashboard/jobs?page=${currentPage + 1}`}>
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