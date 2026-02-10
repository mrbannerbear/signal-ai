"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="size-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mb-6 ring-1 ring-amber-100 dark:ring-amber-900/30">
        <AlertCircle className="size-6 text-amber-600 dark:text-amber-500" />
      </div>
      
      <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
        Something went wrong
      </h2>
      
      <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
        We couldn't load this section. This might be a temporary connection issue.
      </p>

      <div className="flex gap-4 items-center">
        <Button onClick={() => reset()} variant="outline" className="min-w-[120px]">
          <RotateCcw className="mr-2 size-4" />
          Retry
        </Button>
        {error.digest && (
           <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-muted">
             ID: {error.digest.slice(0, 8)}
           </span>
        )}
      </div>
    </div>
  );
}
