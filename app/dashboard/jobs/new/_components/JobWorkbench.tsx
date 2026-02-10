"use client";

import { ArrowRight } from "lucide-react";
import { URLTopBar } from "./URLTopBar";
import { RawInputPane } from "./RawInputPane";
import { StructuredForm } from "./StructuredForm";
import { useState } from "react";
import { Job } from "@/schemas/jobs.schema";

export function JobWorkbench() {
  const [structuredData, setStructuredData] = useState<Job | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [activeTab, setActiveTab] = useState<"input" | "form">("input");

  const handleDataUpdate = (data: Job) => {
    setStructuredData(data);
    setFormVersion((v) => v + 1);
    setActiveTab("form");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 min-h-screen flex flex-col">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Analysis</h1>
          <p className="text-sm text-muted-foreground">Import a job description to begin.</p>
        </div>
        
        <div className="flex bg-muted p-1 rounded-lg border border-border/40 shadow-sm">
          <button
            onClick={() => setActiveTab("input")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === "input"
                ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground/80"
            }`}
          >
            1. Source
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              activeTab === "form"
                ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                : "text-muted-foreground hover:text-foreground/80"
            }`}
          >
            2. Review
          </button>
        </div>
      </div>

      <div className="flex-1">
        {activeTab === "input" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="space-y-6">
               <URLTopBar setStructuredData={handleDataUpdate} />
               
               <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-medium tracking-wide">
                    <span className="bg-background px-3 text-muted-foreground">Or paste text</span>
                  </div>
                </div>

               <RawInputPane setStructuredData={handleDataUpdate} />

               <div className="flex justify-end pt-4">
                 <button
                   onClick={() => setActiveTab("form")}
                   className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                 >
                   Skip to manual entry <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
             </div>
          </div>
        )}

        {activeTab === "form" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <StructuredForm 
              // key={formVersion} 
              structuredData={structuredData} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
