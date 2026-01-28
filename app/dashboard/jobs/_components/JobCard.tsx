import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2 } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function JobCard({ job }: { job: any }) {
  return (
    <Link href={`/dashboard/jobs/${job.id}`}>
      <Card className="p-5 hover:border-primary/50 transition-all group hover:shadow-md h-full flex flex-col justify-between rounded-2xl border-muted/60">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium flex items-center gap-1.5 text-sm">
                <Building2 className="w-3.5 h-3.5" /> {job.company}
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
              {job.status || 'Saved'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wider">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
            <span className="flex items-center gap-1 font-mono uppercase tracking-tighter text-blue-500">
               {job.employment_type}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-muted/50 flex items-center justify-between">
            <div className="flex -space-x-2">
                {job.skills?.slice(0, 3).map((skill: string) => (
                    <div key={skill} className="h-6 px-2 rounded-md bg-muted flex items-center text-[10px] font-bold border border-background">
                        {skill}
                    </div>
                ))}
                {job.skills?.length > 3 && (
                    <div className="h-6 px-2 rounded-md bg-muted flex items-center text-[10px] font-bold border border-background text-muted-foreground">
                        +{job.skills.length - 3}
                    </div>
                )}
            </div>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-widest">
            <Calendar className="w-3 h-3" /> 
            {new Date(job.created_at).toLocaleDateString()}
          </span>
        </div>
      </Card>
    </Link>
  );
}