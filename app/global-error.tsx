"use client"

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-red-100 dark:ring-red-900/30">
              <AlertTriangle className="size-8 text-red-600 dark:text-red-500" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Critical System Error
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              The application encountered a critical error and cannot recover.
              Our engineering team has been notified.
            </p>
            {error.digest && (
              <div className="bg-muted p-3 rounded-lg border border-border">
                <p className="text-xs font-mono text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => reset()} size="lg" className="min-w-[140px]">
              <RefreshCw className="mr-2 size-4" />
              Try again
            </Button>
            <Button variant="outline" size="lg" asChild className="min-w-[140px]">
              <Link href="/">
                <Home className="mr-2 size-4" />
                Return home
              </Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
