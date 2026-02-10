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
  MapPin,
  Globe,
  Linkedin,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  checkIfResume,
  extractPdfText,
  generateFileHash,
  getCachedResume,
  openFile,
} from "@/utils/parseResume";
import { ResumeProfile } from "@/schemas/resume.schema";
import { formatResumeData } from "@/actions/resume";
import { showGracefulError } from "@/components/ui/graceful-toast";
import { toast } from "sonner";

interface ResumeParserProps {
  onApply?: (data: ResumeProfile) => void;
  compact?: boolean;
  layout?: "column" | "row";
}

const ResumeParser = ({ onApply, compact = false, layout = "column" }: ResumeParserProps) => {
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

      // Generate Hash
      const fileHash = await generateFileHash(file);
      const fileMeta = { fileName: file.name, fileHash };

      setStatus("extracting");
      setProgress(30);

      let resumeText = getCachedResume();

      const extracted = await extractPdfText(file);
      if (!checkIfResume(extracted)) {
        toast.error("This does not appear to be a resume.");
        setStatus("idle");
        return;
      }
      resumeText = extracted;

      setStatus("parsing");
      setProgress(65);

      const structuredProfile = await formatResumeData(resumeText, fileMeta);

      setParsedData(structuredProfile);
      setProgress(100);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      if (err instanceof Error) {
        showGracefulError({
          message: err.message,
          retryFn: handleUpload,
          title: "Upload Failed",
        });
      }
    }
  };

  const handleApply = () => {
    if (parsedData && onApply) {
      onApply(parsedData);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-500 px-4 md:px-6 lg:px-8 ${layout === "row" ? "bg-white border text-left shadow-xs" : "border-dashed border-2 bg-zinc-50/50"}`}>
      <CardContent className={`${layout === "row" ? "p-0" : "p-8"}`}>
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${layout === "row" ? "flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center text-left p-6 md:p-8" : "flex-col items-center text-center py-4"}`}
            >
              {layout === "row" ? (
                 <>
                   <div className="flex-1 space-y-2 w-full">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-2">
                        <Sparkles size={24} />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-zinc-900">
                        Auto-Fill with AI
                      </h3>
                      <p className="text-zinc-600 leading-relaxed max-w-md text-sm md:text-base">
                        Have a resume ready? Upload it here and we&apos;ll extract your details to populate the form below instantly.
                      </p>
                  </div>
                  <div className="w-full md:w-auto shrink-0">
                    <Button
                      onClick={handleUpload}
                      size="lg"
                      className="w-full md:w-auto rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm font-medium px-8 h-12"
                    >
                      <Upload className="mr-2 w-5 h-5" />
                      Upload Resume
                    </Button>
                  </div>
                 </>
              ) : (
                <>
                  <Button
                    onClick={handleUpload}
                    variant="outline"
                    className="rounded-lg border-zinc-200 bg-white"
                  >
                    <Upload className="text-zinc-900 w-8 h-8" />
                    Select PDF File
                  </Button>
                </>
              )}
            </motion.div>
          )}

          {(status === "uploading" || status === "parsing" || status === "extracting") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex flex-col items-center justify-center ${layout === "row" ? "p-12" : "py-10"}`}
            >
              <div className="relative mb-6">
                {status === "parsing" ? (
                  <Loader2 className="w-12 h-12 text-zinc-900 animate-spin" />
                ) : (
                  <FileText className="w-12 h-12 text-zinc-300 animate-pulse" />
                )}
              </div>
              <p className="text-sm font-bold text-zinc-900 mb-2 uppercase tracking-widest">
                {status === "uploading"
                  ? "Uploading Resume..."
                  : "AI is extracting data..."}
              </p>
              <div className="w-full max-w-xs">
                <Progress value={progress} className="h-1.5 bg-zinc-100" />
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
              {compact ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={20} className="stroke-3" />
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-900">
                        Resume Parsed!
                      </h3>
                      <p className="text-xs text-emerald-700">
                        We found your details.
                      </p>
                    </div>
                    <Button
                      onClick={handleApply}
                      size="sm"
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl mt-1"
                    >
                      Apply to Form
                    </Button>
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-xs text-zinc-400 hover:text-zinc-600 underline"
                    >
                      Upload different file
                    </button>
                  </div>
                </div>
              ) : (
                <>
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

                  <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-6 max-h-150 overflow-y-auto custom-scrollbar">
                    {/* Header Section */}
                    {/* ... (Detailed View Content) ... */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-zinc-100 text-zinc-900 rounded-xl shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          Candidate Profile
                        </p>
                        <h4 className="text-lg font-bold text-zinc-900 leading-tight">
                          {parsedData?.first_name} {parsedData?.last_name}
                        </h4>
                        {parsedData?.headline && (
                          <p className="text-sm text-zinc-600 font-medium">
                            {parsedData.headline}
                          </p>
                        )}
                        {parsedData?.location && (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                            <MapPin size={12} />
                            {parsedData.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio Section */}
                    {parsedData?.bio && (
                      <div className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                        {parsedData.bio}
                      </div>
                    )}

                    {/* Links Section */}
                    {(parsedData?.portfolio_url || parsedData?.linkedin_url) && (
                      <div className="flex gap-3 flex-wrap">
                        {parsedData.portfolio_url && (
                          <a
                            href={parsedData.portfolio_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                          >
                            <Globe size={12} />
                            Portfolio
                          </a>
                        )}
                        {parsedData.linkedin_url && (
                          <a
                            href={parsedData.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-200 transition-colors"
                          >
                            <Linkedin size={12} />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}

                    {/* Skills Section */}
                    <div>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mb-2.5">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {parsedData?.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] px-2.5 py-1 bg-zinc-100 rounded-md font-semibold text-zinc-600 border border-zinc-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience Section */}
                    {parsedData?.experience &&
                      parsedData.experience.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase size={14} className="text-zinc-400" />
                            <p className="text-[10px] text-zinc-400 font-bold uppercase">
                              Experience
                            </p>
                          </div>
                          <div className="space-y-4">
                            {parsedData.experience.map((exp, i) => (
                              <div
                                key={i}
                                className="relative pl-4 border-l-2 border-zinc-100 pb-1 last:pb-0"
                              >
                                <div className="absolute -left-1.25 top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-300 border-2 border-white" />
                                <div className="flex justify-between items-baseline mb-1">
                                  <h5 className="text-sm font-bold text-zinc-900">
                                    {exp.role}
                                  </h5>
                                  {(exp.start_date || exp.end_date) && (
                                    <span className="text-[10px] text-zinc-400 font-mono">
                                      {exp.start_date} -{" "}
                                      {exp.end_date || "Present"}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-semibold text-emerald-600 mb-2">
                                  {exp.company}
                                </p>
                                <ul className="list-disc list-outside ml-3 space-y-1">
                                  {exp.bullets?.map((bullet, idx) => (
                                    <li
                                      key={idx}
                                      className="text-[11px] text-zinc-600 leading-snug pl-1"
                                    >
                                      {bullet}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Education Section */}
                    {parsedData?.education &&
                      parsedData.education.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <GraduationCap
                              size={14}
                              className="text-zinc-400"
                            />
                            <p className="text-[10px] text-zinc-400 font-bold uppercase">
                              Education
                            </p>
                          </div>
                          <div className="space-y-3">
                            {parsedData.education.map((edu, i) => (
                              <div
                                key={i}
                                className="bg-zinc-50 p-3 rounded-lg border border-zinc-200"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="text-sm font-bold text-zinc-900">
                                      {edu.institution}
                                    </h5>
                                    <p className="text-xs text-zinc-600 mt-0.5">
                                      {edu.degree}
                                    </p>
                                  </div>
                                  {(edu.start_date || edu.end_date) && (
                                    <span className="text-[10px] text-zinc-500 font-mono bg-white px-2 py-0.5 rounded border border-zinc-200">
                                      {edu.start_date} - {edu.end_date}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <Button
                    onClick={handleApply}
                    className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-12 shadow-sm"
                  >
                    Apply to My Profile
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ResumeParser;
