"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, MousePointerClick } from "lucide-react";
import { formatJobData } from "@/actions/jobFormat";
import { Job } from "@/schemas/jobs.schema";

export function RawInputPane({
  setStructuredData
}: {
  setStructuredData: (data: Job) => void;
}) {
  const [hasContent, setHasContent] = useState(false);
  const [rawText, setRawText] = useState<string>("");

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const jobText = await formatJobData(rawText);
        console.log("Fetched Job Text:", jobText);
        setStructuredData(jobText);
      } catch (error) {
          console.error("Error fetching job text:", error);
      }
    }

  return (
    <div className="flex flex-col space-y-3 min-h-75 lg:min-h-0">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">
            Source Material
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-popover text-popover-foreground border-border p-3 rounded-xl shadow-xl max-w-62.5">
                <p className="text-xs leading-relaxed">
                  If a URL scraper is blocked by the site, simply copy and paste
                  the entire job description text here manually.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] uppercase font-black tracking-tighter"
        >
          Raw Input
        </Badge>
      </div>

      <div className="relative flex-1 group">
        <Textarea
          onChange={(e) => {
            setHasContent(e.target.value.length > 0);
            setRawText(e.target.value);
          }}
          placeholder=""
          className="h-full p-6 resize-none bg-muted/20 border-dashed border-2 rounded-[2rem] focus-visible:ring-1 transition-all text-sm md:text-base leading-relaxed"
        />
        {!hasContent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted-foreground/30 space-y-3">
            <MousePointerClick className="h-10 w-10 opacity-20" />
            <p className="text-sm font-semibold italic">
              Paste messy job text here...
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={onSubmit}
      >Analyze</button>
    </div>
  );
}
