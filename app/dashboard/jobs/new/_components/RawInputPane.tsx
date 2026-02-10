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
import { Button } from "@/components/ui/button";
import { MessageSquareText, Wand2, Loader2 } from "lucide-react";
import { formatJobData } from "@/actions/jobFormat";
import { Job } from "@/schemas/jobs.schema";
import { toast } from "sonner";
import { showGracefulError } from "@/components/ui/graceful-toast";

export function RawInputPane({
  setStructuredData
}: {
  setStructuredData: (data: Job) => void;
}) {
  const [hasContent, setHasContent] = useState(false);
  const [rawText, setRawText] = useState<string>("");
  const [isPending, setIsPending] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPending(true);
      const toastId = toast.loading("Analyzing job text...");

      try {
        const jobText = await formatJobData(rawText);
        setStructuredData(jobText);
        toast.success("Raw text extracted successfully", { id: toastId });
      } catch (error) {
          console.error("Error fetching job text:", error);
          toast.dismiss(toastId);
          showGracefulError({
            message: "Failed to parse the job text. Please try again or check the format.",
            title: "Analysis Failed"
          });
      } finally {
        setIsPending(false);
      }
    }

  return (
    <div className="flex flex-col space-y-3 min-h-75 lg:min-h-0">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground tracking-tight">
            Raw Text Input
          </span>
        </div>
        <Badge
          variant="secondary"
          className="text-[10px] uppercase font-bold tracking-wider bg-muted text-muted-foreground"
        >
          Manual Override
        </Badge>
      </div>

      <div className="bg-muted/30 border border-primary/10 rounded-lg p-4 mb-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">How it works:</span> If the URL scraper fails or you have an internal document, paste the full job description below. Our AI will structure it automatically.
        </p>
      </div>

      <div className="relative flex-1 group min-h-[300px]">
        <Textarea
          onChange={(e) => {
            setHasContent(e.target.value.length > 0);
            setRawText(e.target.value);
          }}
          disabled={isPending}
          placeholder="Paste the full job description here..."
          className="h-full min-h-[300px] p-6 resize-y bg-card border-2 border-dashed border-border/60 rounded-xl focus-visible:ring-1 focus-visible:border-primary/50 transition-all text-sm leading-relaxed shadow-sm disabled:opacity-50"
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onSubmit}
          className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-md font-semibold px-8 rounded-xl disabled:opacity-70"
          size="lg"
          disabled={!hasContent || isPending}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          {isPending ? "Analyzing..." : "Analyze Text"}
        </Button>
      </div>
    </div>
  );
}
