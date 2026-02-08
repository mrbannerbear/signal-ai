"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowRight,
  Building2,
  Briefcase,
  DollarSign,
  Wand2,
  X,
  Plus,
} from "lucide-react";
import { Job, jobSchema } from "@/schemas/jobs.schema";
import { createJob } from "@/actions/jobs";
import { useRouter } from "next/navigation";

export function StructuredForm({
  structuredData,
}: {
  structuredData: Job | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define defaults derived straight from props
  const defaultJobValues = {
    title: structuredData?.title || "",
    company: structuredData?.company || "",
    company_description: structuredData?.company_description || "",
    location: structuredData?.location || "",
    employment_type: structuredData?.employment_type || "Full-time",
    experience_level: structuredData?.experience_level || "Mid",
    compensation: structuredData?.compensation || "",
    description: structuredData?.description || "",
    responsibilities: structuredData?.responsibilities || "",
    requirements: structuredData?.requirements || "",
    skills: structuredData?.skills || ([] as string[]),
    other_benefits: structuredData?.other_benefits || "",
    posted_date:
      structuredData?.posted_date || new Date().toISOString().split("T")[0],
  };

  const form = useForm<Job>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(jobSchema) as any,
    defaultValues: defaultJobValues,
  });

  const [skillInput, setSkillInput] = useState("");
  const router = useRouter();

  const skills = form.watch("skills") as string[];

  const addSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      form.setValue("skills", [...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    form.setValue(
      "skills",
      skills.filter((s) => s !== skillToRemove),
    );
  };

  const onSubmit: SubmitHandler<Job> = async (values) => {
    setIsSubmitting(true);
    try {
      const result = await createJob(values);
      if (result.success) {
        router.push(`/dashboard/jobs/${result.id}`);
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof Job, {
              type: "server",
              message: messages[0],
            });
          });
        }
      }
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 md:p-10 space-y-8"
          >
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
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black text-muted-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                        <Briefcase className="h-3 w-3" /> Job Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="eg: Senior Frontend Engineer"
                          className="border-none bg-muted/40 h-11 px-4 rounded-xl font-medium focus:bg-muted/60 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black text-muted-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                        <Building2 className="h-3 w-3" /> Company
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="eg: Stripe"
                          className="border-none bg-muted/40 h-11 px-4 rounded-xl font-medium focus:bg-muted/60 transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Remote, New York, etc."
                          className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="posted_date"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                        Posted Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                          value={
                            field.value &&
                            !isNaN(new Date(field.value).getTime())
                              ? new Date(field.value)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator className="opacity-30" />

            {/* Section 2: Logistics & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="employment_type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Employment Type
                    </FormLabel>
                    <FormControl>
                      <select
                        className="w-full border-none bg-muted/40 h-11 px-4 rounded-xl text-sm focus:ring-1 focus:ring-primary/20 outline-none"
                        {...field}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Temporary">Temporary</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Experience Level
                    </FormLabel>
                    <FormControl>
                      <select
                        className="w-full border-none bg-muted/40 h-11 px-4 rounded-xl text-sm focus:ring-1 focus:ring-primary/20 outline-none"
                        {...field}
                      >
                        <option value="Entry">Entry</option>
                        <option value="Mid">Mid</option>
                        <option value="Senior">Senior</option>
                        <option value="Director">Director</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="opacity-30" />

            {/* Section 3: The Meat */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Job Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the role..."
                        className="border-none bg-muted/40 min-h-25 rounded-xl focus:bg-muted/60 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Responsibilities
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What will you do?"
                        className="border-none bg-muted/40 min-h-25 rounded-xl focus:bg-muted/60 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Requirements
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What do you need?"
                        className="border-none bg-muted/40 min-h-25 rounded-xl focus:bg-muted/60 transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tech Stack */}
            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest flex justify-between">
                    Tech Stack
                    <span className="text-[9px] font-medium lowercase opacity-50 italic tracking-normal">
                      Enter to add
                    </span>
                  </FormLabel>

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
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="opacity-30" />

            {/* Section 4: Benefits & Perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="compensation"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black text-muted-foreground/70 flex items-center gap-2 uppercase tracking-widest">
                      <DollarSign className="h-3 w-3" /> Compensation
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg: $140k - $180k"
                        className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="other_benefits"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                      Other Benefits
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Equity, 401k, PTO..."
                        className="border-none bg-muted/40 h-11 px-4 rounded-xl focus:bg-muted/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-base md:text-lg font-black bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-primary/20 rounded-2xl group"
            >
              {isSubmitting ? "Saving..." : "Save & Analyze Match"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
