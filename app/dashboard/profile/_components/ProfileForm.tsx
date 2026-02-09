"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type Profile } from "@/schemas/profiles.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTransition } from "react";
import { toast } from "sonner";
import { Globe, Loader2, MapPin } from "lucide-react";
import { createProfileAction, updateProfileAction } from "@/actions/profiles";
import { useRouter } from "next/navigation";
import { SkillsSection } from "./SkillSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { useEffect } from "react";
import { ResumeProfile } from "@/schemas/resume.schema";

export function ProfileForm({ 
  initialData, 
  importedData,
  onCancel
}: { 
  initialData?: Profile; 
  importedData?: ResumeProfile | null;
  onCancel?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<Profile>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileSchema) as Resolver<Profile, any>,
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      headline: "",
      bio: "",
      skills: [],
      location: "",
      portfolioUrl: "",
      linkedinUrl: "",
      experience: [],
      education: [],
    },
  });

  // Effect to handle imported resume data
  useEffect(() => {
    if (!importedData) return;

    const currentValues = form.getValues();
    let updatesCount = 0;

    // Helper to update only if field is empty
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateIfEmpty = (key: keyof Profile, value: any) => {
      if (value && !currentValues[key]) {
        form.setValue(key, value, { shouldDirty: true });
        updatesCount++;
      }
    };

    updateIfEmpty("firstName", importedData.firstName);
    updateIfEmpty("lastName", importedData.lastName);
    updateIfEmpty("headline", importedData.headline);
    updateIfEmpty("bio", importedData.bio);
    updateIfEmpty("location", importedData.location);
    updateIfEmpty("portfolioUrl", importedData.portfolioUrl);
    updateIfEmpty("linkedinUrl", importedData.linkedinUrl);
    
    // SKILLS
    if (importedData.skills && importedData.skills.length > 0) {
       const currentSkills = form.getValues("skills") || [];
       const newSkills = importedData.skills
         .filter(skillName => !currentSkills.some(s => s.name.toLowerCase() === skillName.toLowerCase()))
         .map(name => ({ name, level: "Intermediate" as const }));
       
       if (newSkills.length > 0) {
         form.setValue("skills", [...currentSkills, ...newSkills], { shouldDirty: true });
         updatesCount++;
       }
    }

    // EXPERIENCE
    if (importedData.experience && importedData.experience.length > 0) {
      // Map format
      const mappedExperience = importedData.experience.map(exp => ({
         companyName: exp.company,
         role: exp.role,
         startDate: exp.startDate ? new Date(exp.startDate) : new Date(), // Fallback to now if invalid? Zod will validate. 
         // Actually, let's try to parse strings validly. parser gives "YYYY-MM" or "Present".
         // We might need a helper to safely parse loose date strings. For now, simple Date constructor.
         endDate: exp.endDate && exp.endDate.toLowerCase() !== "present" ? new Date(exp.endDate) : undefined,
         isCurrent: !exp.endDate || exp.endDate.toLowerCase() === "present",
         description: exp.bullets ? exp.bullets.join("\n• ") : "", // Add bullet points
         location: "",
         position: 0
      }));

      // Strategy: If form has no experience, set it.
      const currentExp = form.getValues("experience");
      if (!currentExp || currentExp.length === 0) {
        form.setValue("experience", mappedExperience, { shouldDirty: true });
        updatesCount++;
      }
    }

    // EDUCATION
    if (importedData.education && importedData.education.length > 0) {
       const mappedEducation = importedData.education.map(edu => ({
         institution: edu.institution,
         degree: edu.degree || "",
         startDate: edu.startDate ? new Date(edu.startDate) : undefined,
         graduationDate: edu.endDate ? new Date(edu.endDate) : undefined,
         position: 0
       }));

       const currentEdu = form.getValues("education");
       if (!currentEdu || currentEdu.length === 0) {
         form.setValue("education", mappedEducation, { shouldDirty: true });
         updatesCount++;
       }
    }

    if (updatesCount > 0) {
      toast.success(`Profile updated with ${updatesCount} fields from resume!`);
    }

  }, [importedData, form]);

  async function onSubmit(values: Profile) {
    startTransition(async () => {
      const result = initialData?.id 
        ? await updateProfileAction(initialData.id, values)
        : await createProfileAction(values);

      if (result.success) {
        toast.success("Profile saved!");
        router.push("/dashboard/profile"); 
        router.refresh();
      } else {
        toast.error(result.message || "Failed to save profile");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-10 pb-10">
        
        {/* IDENTITY */}
        <div className="grid gap-6 p-6 md:p-8 border border-zinc-200 rounded-xl bg-card shadow-xs">
          <h2 className="text-xl font-semibold text-zinc-900">Identity & Persona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem><FormLabel className="text-zinc-700">First Name</FormLabel><FormControl><Input placeholder="Jane" {...field} className="rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem><FormLabel className="text-zinc-700">Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} className="rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="headline" render={({ field }) => (
            <FormItem><FormLabel className="text-zinc-700">Headline</FormLabel><FormControl><Input placeholder="e.g. Senior Fullstack Developer" {...field} className="rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem><FormLabel className="text-zinc-700">Bio</FormLabel><FormControl><Textarea placeholder="Tell us about yourself..." className="min-h-25 rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel className="flex gap-2 text-zinc-700"><MapPin className="w-4 h-4 text-emerald-500"/> Location</FormLabel><FormControl><Input placeholder="San Francisco, CA" {...field} className="rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
            <FormItem><FormLabel className="flex gap-2 text-zinc-700"><Globe className="w-4 h-4 text-emerald-500"/> Portfolio</FormLabel><FormControl><Input placeholder="https://portfolio.com" {...field} className="rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
            <FormItem><FormLabel className="text-zinc-700">LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/jane" {...field} className="rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl></FormItem>
          )} />
        </div>

        <SkillsSection control={form.control} />

        <ExperienceSection control={form.control} />
        
        <EducationSection control={form.control} />

        <div className="flex flex-col-reverse md:flex-row gap-4">
          {onCancel && (
             <Button 
               type="button" 
               variant="outline" 
               onClick={onCancel}
               className="w-full md:flex-1 h-12 md:h-14 text-base md:text-lg font-semibold rounded-xl uppercase border-2 text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
              >
               Cancel
             </Button>
          )}
          <Button type="submit" disabled={isPending} className="w-full md:flex-2 h-12 md:h-14 text-base md:text-lg font-bold rounded-xl uppercase shadow-xl shadow-zinc-200/50 hover:shadow-zinc-200 transition-all bg-zinc-900 hover:bg-zinc-800 text-white">
            {isPending ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : "Save Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}