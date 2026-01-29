"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  CheckCircle2,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { checkIfResume, extractPdfText, getCachedResume, openFile, setCachedResume } from "@/utils/parseResume";
import { ResumeProfile } from "@/schemas/resume.schema";
import { formatResumeData } from "@/actions/resume";

const ResumeParser = () => {
  const [status, setStatus] = useState<
    "idle" | "uploading" | "extracting" | "parsing" | "success" | "error"
  >("idle");

  const [parsedData, setParsedData] = useState<ResumeProfile | null>(null);

  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    setStatus("uploading");
    setProgress(10);

    try {
      const file = await openFile();
      if (!file) {
        setStatus("idle");
        return;
      }

      setStatus("extracting");
      setProgress(30);

      let resumeText = getCachedResume();

      if (!resumeText) {
        const extracted = await extractPdfText(file);

        if (!checkIfResume(extracted)) {
          alert("This does not appear to be a resume.");
          setStatus("idle");
          return;
        }

        resumeText = extracted;
        setCachedResume(resumeText);
      }

      setStatus("parsing");
      setProgress(65);

      const structuredProfile = await formatResumeData(resumeText);

      setParsedData(structuredProfile);
      setProgress(100);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <Card className="border-dashed border-2 bg-slate-50/50 overflow-hidden transition-all duration-500">
      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                <Upload className="text-indigo-600 w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Import from Resume
              </h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">
                Drop your PDF here. Our AI will extract your skills and
                experience to save you time.
              </p>
              <Button
                onClick={handleUpload}
                variant="outline"
                className="rounded-xl border-slate-200 bg-white"
              >
                Select PDF File
              </Button>
            </motion.div>
          )}

          {(status === "uploading" || status === "parsing") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 flex flex-col items-center"
            >
              <div className="relative mb-6">
                {status === "parsing" ? (
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                ) : (
                  <FileText className="w-12 h-12 text-slate-400 animate-pulse" />
                )}
              </div>
              <p className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-widest">
                {status === "uploading"
                  ? "Uploading Resume..."
                  : "AI is extracting data..."}
              </p>
              <div className="w-full max-w-xs">
                <Progress value={progress} className="h-1.5" />
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-bold uppercase tracking-tight">
                    Ready to Sync
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatus("idle")}
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Candidate Detected
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {parsedData?.firstName} {parsedData?.lastName}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">
                    Skills Extracted
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData?.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12">
                Apply to My Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ResumeParser;
