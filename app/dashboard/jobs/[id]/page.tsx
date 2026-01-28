import { createClient } from "@/app/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Badge, Check, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [jobRes, profileRes] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", id).single(),
    user 
      ? supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle() 
      : Promise.resolve({ data: null })
  ]);

  if (jobRes.error || !jobRes.data) throw new Error("Job not found");
  
  const job = jobRes.data;
  const profile = profileRes?.data;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* 1. Header: Quick Context & Status */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium uppercase tracking-widest">
            <Link href="/dashboard/jobs" className="hover:text-primary transition-colors">Jobs</Link>
            <span>/</span>
            <span className="text-foreground">{job.company}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">{job.title}</h1>
          <div className="flex flex-wrap gap-4 pt-2">
             <Badge className="rounded-md border-primary/20 bg-primary/5 text-primary">
               {job.employment_type}
             </Badge>
             <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
               <MapPin className="w-4 h-4" /> {job.location}
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <Button variant="outline" className="rounded-xl font-bold">Edit Details</Button>
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 bg-primary">
              Mark as Applied
            </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: THE INTEL (70%) */}
        <div className="lg:col-span-2 space-y-10">
          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">The Role</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground/70">Requirements</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {job.requirements}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: THE SIGNAL (30%) */}
        <aside className="space-y-6">
          {/* AI MATCH CARD */}
          <Card className="p-6 rounded-[2.5rem] border-primary/20 bg-primary/2 shadow-2xl relative overflow-hidden">
             {/* Match Score Gauge */}
             <div className="text-center space-y-2 relative z-10">
               <div className="inline-flex items-center justify-center p-4 rounded-full bg-background border shadow-inner mb-2">
                 <span className="text-4xl font-black text-primary">{job.match_score || "—"}%</span>
               </div>
               <h3 className="font-bold text-xl italic tracking-tight">Signal Strength</h3>
               <p className="text-xs text-muted-foreground px-4 leading-relaxed">
                 Based on your current profile and the <strong>{job.skills?.length}</strong> detected tech requirements.
               </p>
             </div>

             <Separator className="my-6 opacity-50" />

             {/* Skills Comparison */}
             <div className="space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-widest flex justify-between">
                 Skills Gap <span>Match / Missing</span>
               </h4>
               <div className="flex flex-wrap gap-2">
                  {/* Simplified Skill Tags */}
                  {job.skills?.map((skill: string) => {
                    const isMatched = profile?.skills?.includes(skill);
                    return (
                      <Badge
                        key={skill} 
                        className={`rounded-lg px-2 py-1 text-[10px] uppercase font-bold ${
                          isMatched ? "bg-green-500 hover:bg-green-600" : "bg-muted text-muted-foreground/50"
                        }`}
                      >
                        {isMatched && <Check className="w-2.5 h-2.5 mr-1" />}
                        {skill}
                      </Badge>
                    );
                  })}
               </div>
             </div>

             {/* AI Insight Placeholder */}
             <div className="mt-8 p-4 rounded-2xl bg-background/50 border border-dashed border-primary/20">
                <p className="text-[11px] text-muted-foreground italic font-medium">
                  &quot;You match 80% of the stack. Mentioning your experience with <strong>{job.skills?.[0]}</strong> in your bio would raise your signal to 90%.&quot;
                </p>
             </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 rounded-[2rem] border-muted/50">
             <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company Site</span>
                  <a href="#" className="text-primary hover:underline flex items-center gap-1">Visit <ExternalLink className="w-3 h-3"/></a>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Salary</span>
                  <span className="text-foreground">{job.compensation || "Not listed"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="text-foreground font-bold">{job.experience_level}</span>
                </div>
             </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}