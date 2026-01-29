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
import { toast } from "sonner"; // Assuming sonner is available for toasts

interface ResumeParserProps {
  onApply?: (data: ResumeProfile) => void;
}

const ResumeParser = ({ onApply }: ResumeParserProps) => {
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

      // Note: We still extract text client-side because formatResumeData needs it if it's a MISS.
      // Optimization: We could ASK server "Do you have this hash?" first.
      // But for simplicity/MVP, we extract text (fast enough for 1-2 page PDFs) 
      // and send it along. The server will ignore the text if it finds a cache hit.

      let resumeText = getCachedResume();

      // Simple optimization: If local text cache exists, is it for the same file?
      // Since we don't store file hash in localstorage for the text, we might mismatch.
      // Safest: Always extract fresh text for the clicked file to be sure.
      // Refactoring to ignore 'getCachedResume' for text to ensure correctness with file picker.
      
      const extracted = await extractPdfText(file);
      if (!checkIfResume(extracted)) {
          alert("This does not appear to be a resume.");
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
        toast.error(err.message);
      }
    }
  };

  const handleApply = () => {
    if (parsedData && onApply) {
      onApply(parsedData);
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

              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6 max-h-150 overflow-y-auto custom-scrollbar">
                {/* Header Section */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Candidate Profile
                    </p>
                    <h4 className="text-lg font-bold text-slate-900 leading-tight">
                      {parsedData?.firstName} {parsedData?.lastName}
                    </h4>
                    {parsedData?.headline && (
                      <p className="text-sm text-slate-600 font-medium">
                        {parsedData.headline}
                      </p>
                    )}
                    {parsedData?.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin size={12} />
                        {parsedData.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                {parsedData?.bio && (
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {parsedData.bio}
                  </div>
                )}

                {/* Links Section */}
                {(parsedData?.portfolioUrl || parsedData?.linkedinUrl) && (
                  <div className="flex gap-3 flex-wrap">
                    {parsedData.portfolioUrl && (
                      <a
                        href={parsedData.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        <Globe size={12} />
                        Portfolio
                      </a>
                    )}
                    {parsedData.linkedinUrl && (
                      <a
                        href={parsedData.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Linkedin size={12} />
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}

                {/* Skills Section */}
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2.5">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData?.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2.5 py-1 bg-slate-100 rounded-md font-semibold text-slate-600 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience Section */}
                {parsedData?.experience && parsedData.experience.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase size={14} className="text-slate-400" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Experience
                      </p>
                    </div>
                    <div className="space-y-4">
                      {parsedData.experience.map((exp, i) => (
                        <div
                          key={i}
                          className="relative pl-4 border-l-2 border-slate-100 pb-1 last:pb-0"
                        >
                          <div className="absolute -left-1.25 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                          <div className="flex justify-between items-baseline mb-1">
                            <h5 className="text-sm font-bold text-slate-800">
                              {exp.role}
                            </h5>
                            {(exp.startDate || exp.endDate) && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {exp.startDate} - {exp.endDate || "Present"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-indigo-600 mb-2">
                            {exp.company}
                          </p>
                          <ul className="list-disc list-outside ml-3 space-y-1">
                            {exp.bullets?.map((bullet, idx) => (
                              <li
                                key={idx}
                                className="text-[11px] text-slate-600 leading-snug pl-1"
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
                {parsedData?.education && parsedData.education.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap size={14} className="text-slate-400" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Education
                      </p>
                    </div>
                    <div className="space-y-3">
                      {parsedData.education.map((edu, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-sm font-bold text-slate-800">
                                {edu.institution}
                              </h5>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {edu.degree}
                              </p>
                            </div>
                            {(edu.startDate || edu.endDate) && (
                              <span className="text-[10px] text-slate-400 font-mono bg-white px-2 py-0.5 rounded border border-slate-100">
                                {edu.startDate} - {edu.endDate}
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
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 shadow-md shadow-indigo-200"
              >
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
