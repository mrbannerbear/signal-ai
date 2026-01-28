"use client";

import { UXStepper } from "./UXStepper";
import { URLTopBar } from "./URLTopBar";
import { RawInputPane } from "./RawInputPane";
import { StructuredForm } from "./StructuredForm";
import { useState } from "react";
import { Job } from "@/schemas/jobs.schema";

export function JobWorkbench() {
  const [structuredData, setStructuredData] = useState<Job | null>(null);
  const [formVersion, setFormVersion] = useState(0);
  const handleDataUpdate = (data: Job) => {
    setStructuredData(data);
    setFormVersion((v) => v + 1);
  };
  return (
    <div className="max-w-350 mx-auto p-4 md:p-6 space-y-6 min-h-screen flex flex-col">
      <UXStepper />
      <URLTopBar setStructuredData={handleDataUpdate} />
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8 flex-1 lg:h-[calc(100vh-260px)]">
        <RawInputPane setStructuredData={handleDataUpdate} />
        <StructuredForm 
          key={formVersion} 
          structuredData={structuredData} 
        />
      </div>
    </div>
  );
}
