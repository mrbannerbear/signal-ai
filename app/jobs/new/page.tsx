"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sparkles,
  Link as LinkIcon,
  ArrowRight,
  Building2,
  Briefcase,
  DollarSign,
  HelpCircle,
  CheckCircle2,
  MousePointerClick,
  Wand2,
  X,
  Plus,
} from "lucide-react";

export default function JobWorkbench() {
  // UI States
  const [hasContent, setHasContent] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Tech Stack State
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="max-w-350 mx-auto p-4 md:p-6 space-y-6 min-h-screen flex flex-col">
      {/* 1. UX Stepper - Contextual Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            step: 1,
            label: "Paste Source",
            desc: "URL or Raw Text",
            icon: <LinkIcon className="w-3 h-3" />,
          },
          {
            step: 2,
            label: "Extract Intel",
            desc: "AI structures data",
            icon: <Sparkles className="w-3 h-3" />,
          },
          {
            step: 3,
            label: "Refine & Save",
            desc: "Start the analysis",
            icon: <CheckCircle2 className="w-3 h-3" />,
          },
        ].map((item) => (
          <div
            key={item.step}
            className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-2xl border border-border/50"
          >
            <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
              {item.step}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-tight leading-none mb-1">
                {item.label}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. URL Top Bar */}
      <Card className="p-1.5 md:p-2 border-primary/20 bg-background/50 backdrop-blur-md sticky top-2 md:top-4 z-20 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Paste job URL (LinkedIn, Indeed, Lever...)"
              className="pl-9 border-none bg-transparent focus-visible:ring-0 text-base md:text-lg w-full"
            />
          </div>
          <Button
            size="lg"
            className="rounded-full px-4 md:px-8 shadow-lg hover:shadow-primary/20 transition-all w-full sm:w-auto font-bold"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Scrape Job
          </Button>
        </div>
      </Card>

      {/* Main Workbench Container */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8 flex-1 lg:h-[calc(100vh-260px)]">
        {/* 3. Left Pane: Raw Input */}
        <div className="flex flex-col space-y-3 min-h-75 lg:min-h-0">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">
                Source Material
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border-border p-3 rounded-xl shadow-xl max-w-62.5">
                    <p className="text-xs leading-relaxed">
                      If a URL scraper is blocked by the site, simply copy and
                      paste the entire job description text here manually.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-black tracking-tighter"
            >
              Raw Input
            </Badge>
          </div>

          <div className="relative flex-1 group">
            <Textarea
              onChange={(e) => setHasContent(e.target.value.length > 0)}
              placeholder=""
              className="h-full p-6 resize-none bg-muted/20 border-dashed border-2 rounded-[2rem] focus-visible:ring-1 transition-all text-sm md:text-base leading-relaxed"
            />
            {!hasContent && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted-foreground/30 space-y-3">
                <MousePointerClick className="h-10 w-10 opacity-20" />
                <p className="text-sm font-semibold italic">
                  Paste messy job text here...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Right Pane: Structured Form */}
        <div className="flex flex-col space-y-3 min-h-125 lg:min-h-0">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Structured Extraction
            </span>
            <div className="flex items-center gap-2 font-mono">
              <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                AI SYNC READY
              </div>
            </div>
          </div>

          <Card className="flex-1 overflow-y-auto rounded-[2rem] shadow-sm border-muted/50 flex flex-col relative">
            <div className="p-6 md:p-10 space-y-8">
              {/* Contextual Hint */}
              <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex gap-3 items-start">
                <Wand2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  The fields below are{" "}
                  <span className="text-primary font-bold">
                    automatically populated
                  </span>{" "}
                  by AI. You can manually override any detail.
                </p>
              </div>

              {/* Section 1: Core Identity */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                      <Briefcase className="h-3 w-3" /> Job Title
                    </label>
                    <Input
                      placeholder="eg: Senior Frontend Engineer"
                      className="border-none bg-muted/40 h-11 px-4 rounded-xl font-medium focus:bg-muted/60 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                      <Building2 className="h-3 w-3" /> Company
                    </label>
                    <Input
                      placeholder="eg: Stripe"
                      className="border-none bg-muted/40 h-11 px-4 rounded-xl font-medium focus:bg-muted/60 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Location
                    </label>
                    <Input
                      placeholder="Remote, New York, etc."
                      className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Posted Date
                    </label>
                    <Input
                      type="date"
                      className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                    />
                  </div>
                </div>
              </div>

              <Separator className="opacity-30" />

              {/* Section 2: Logistics & Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                    Employment Type
                  </label>
                  <select className="w-full border-none bg-muted/40 h-11 px-4 rounded-xl text-sm focus:ring-1 focus:ring-primary/20 outline-none">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                    Experience Level
                  </label>
                  <select className="w-full border-none bg-muted/40 h-11 px-4 rounded-xl text-sm focus:ring-1 focus:ring-primary/20 outline-none">
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Director">Director</option>
                  </select>
                </div>
              </div>

              <Separator className="opacity-30" />

              {/* Section 3: The Meat */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                    Responsibilities
                  </label>
                  <Textarea
                    placeholder="What will you do?"
                    className="border-none bg-muted/40 min-h-25 rounded-xl focus:bg-muted/60 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                    Requirements
                  </label>
                  <Textarea
                    placeholder="What do you need?"
                    className="border-none bg-muted/40 min-h-25 rounded-xl focus:bg-muted/60 transition-colors"
                  />
                </div>
              </div>

                              <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest flex justify-between">
                    Tech Stack
                    <span className="text-[9px] font-medium lowercase opacity-50 italic tracking-normal">
                      Enter to add
                    </span>
                  </label>

                  <div className="flex flex-col gap-3 p-4 bg-muted/40 rounded-2xl border border-dashed border-muted-foreground/20 min-h-30 transition-all focus-within:border-primary/40 focus-within:bg-muted/60">
                    <div className="flex flex-wrap gap-2">
                      {skills.length === 0 && (
                        <span className="text-[10px] text-muted-foreground/40 italic font-medium py-1">
                          AI will parse these, or add manually...
                        </span>
                      )}
                      <AnimatePresence>
                        {skills.map((skill) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <Badge
                              variant="secondary"
                              className="pl-3 pr-1 py-1 gap-1 bg-background border-primary/10 hover:border-primary/30 transition-colors group/tag shadow-sm"
                            >
                              <span className="text-[11px] font-semibold">
                                {skill}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="hover:bg-destructive/10 rounded-full p-0.5 transition-colors"
                              >
                                <X className="h-3 w-3 text-muted-foreground group-hover/tag:text-destructive" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="relative">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Add skill..."
                        className="h-8 text-[11px] bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded-lg pl-8"
                      />
                      <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                    </div>
                  </div>
                </div>

              <Separator className="opacity-30" />

              {/* Section 4: Benefits & Perks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                    <DollarSign className="h-3 w-3" /> Compensation
                  </label>
                  <Input
                    placeholder="eg: $140k - $180k"
                    className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                    Other Benefits
                  </label>
                  <Input
                    placeholder="Equity, 401k, PTO..."
                    className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                    <DollarSign className="h-3 w-3" /> Compensation
                  </label>
                  <Input
                    placeholder="Range (e.g. $140k - $190k)"
                    className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60 transition-colors"
                  />
                </div>
              </div>

              <Button className="w-full h-14 text-base md:text-lg font-black bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-primary/20 rounded-2xl group">
                Save & Analyze Match
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
