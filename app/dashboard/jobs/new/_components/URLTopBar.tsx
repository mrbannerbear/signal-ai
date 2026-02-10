"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Link as LinkIcon } from "lucide-react";
import { useRef, useState } from "react";
import { fetchJobTextFromURL } from "@/actions/scraper";
import { Job } from "@/schemas/jobs.schema";
import { toast } from "sonner";
import { showGracefulError } from "@/components/ui/graceful-toast";
import { Loader2 } from "lucide-react";

export function URLTopBar(
    { setStructuredData }: { setStructuredData: (data: Job) => void }
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current?.value) return;
    
    setIsPending(true);
    const toastId = toast.loading("Scraping job details...");

    try {
      const jobText = await fetchJobTextFromURL(inputRef.current.value);
      setStructuredData(jobText);
      toast.success("Job data extracted successfully", { id: toastId });
    } catch (error) {
        console.error("Error fetching job text:", error);
        toast.dismiss(toastId);
        showGracefulError({
          message: "Could not scrape this URL. Some sites block automated access.",
          actionLabel: "Try Raw Input",
          retryFn: undefined, // No retry for scraping blocks, improved guidance
          title: "Scraping Failed"
        });
    } finally {
      setIsPending(false);
    }
  }
  return (
    <Card className="p-1.5 md:p-2 border-border/40 bg-card relative top-2 md:top-4 z-20 shadow-sm rounded-xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            disabled={isPending}
            placeholder="Paste job URL here (LinkedIn, Indeed, etc)..."
            className="pl-9 border-none bg-transparent focus-visible:ring-0 text-base md:text-lg w-full placeholder:text-muted-foreground/50 disabled:opacity-50"
          />
        </div>
        <Button
          size="lg"
          disabled={isPending}
          className="rounded-lg px-6 shadow-sm hover:shadow-md transition-all w-full sm:w-auto font-semibold bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-70"
          onClick={onSubmit}
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {isPending ? "Scraping..." : "Scrape Job"}
        </Button>
      </div>
    </Card>
  );
}
