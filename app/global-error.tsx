"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Something went wrong
            </h1>
            
            <p className="text-slate-500 mb-6">
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
            
            {error.digest && (
              <p className="text-xs text-slate-400 mb-6 font-mono">
                Error ID: {error.digest}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={reset}
                className="rounded-full font-semibold bg-indigo-600 hover:bg-indigo-700 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-full font-semibold border-slate-200 hover:bg-slate-50 gap-2 w-full sm:w-auto"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
