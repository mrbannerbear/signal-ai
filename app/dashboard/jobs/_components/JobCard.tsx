import { Card } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Job } from "@/schemas/jobs.schema";
import { Badge } from "@/components/ui/badge";

export function JobCard({
  job,
  isAnalysis,
  selectedJobId,
  setSelectedJobId,
}: {
  job: Job;
  isAnalysis?: boolean;
  selectedJobId?: string | null;
  setSelectedJobId?: (id: string | null) => void;
}) {
  const isSelected = isAnalysis && selectedJobId === job.id;
  const isDimmed = isAnalysis && selectedJobId && selectedJobId !== job.id;

  return (
    <Card
      className={cn(
        "cursor-pointer h-full p-6 bg-white hover:bg-zinc-50 border border-zinc-200 shadow-xs hover:shadow-md transition-all rounded-xl group flex flex-col justify-between relative overflow-hidden",
        isSelected &&
          "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30",
        isDimmed && "opacity-50 grayscale-[0.3]",
      )}
      onClick={() => {
        if (!isAnalysis || !job.id) {
          return;
        }
        if (isSelected) {
          setSelectedJobId?.(null);
          return;
        }
        setSelectedJobId?.(job.id);
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100/50 rounded-bl-full -mr-16 -mt-16 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-5 relative z-10">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-zinc-900 group-hover:text-emerald-700 transition-colors leading-tight">
              {job.title}
            </h3>
            <p className="text-zinc-500 font-medium flex items-center gap-1.5 text-sm">
              <Building2 className="w-4 h-4 text-emerald-500" /> {job.company}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide",
              job.has_applied
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "hidden",
            )}
          >
            {job.has_applied ? "Applied" : ""}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {job.location}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700">
            {job.employment_type}
          </span>
          {job.compensation && (
            <span className="flex items-center gap-1.5 text-emerald-600">
              <DollarSign className="w-3.5 h-3.5" /> {job.compensation}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-zinc-100 flex items-center justify-between relative z-10">
        <div className="flex -space-x-2">
          {job.skills?.slice(0, 3).map((skill: string) => (
            <div
              key={skill}
              className="h-7 px-2.5 rounded-lg bg-zinc-50 flex items-center text-[10px] font-bold border border-white text-zinc-600 shadow-sm z-10 ring-2 ring-white"
            >
              {skill}
            </div>
          ))}
          {job.skills?.length > 3 && (
            <div className="h-7 px-2.5 rounded-lg bg-zinc-100 flex items-center text-[10px] font-bold border border-white text-zinc-500 shadow-sm z-0 ring-2 ring-white">
              +{job.skills.length - 3}
            </div>
          )}
        </div>

        {isAnalysis ? (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Analyze <ArrowRight className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="text-[10px] text-zinc-400 flex items-center gap-1.5 font-bold tracking-widest uppercase">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(job.posted_date as string).toLocaleDateString()}
          </span>
        )}
      </div>
    </Card>
  );
}
