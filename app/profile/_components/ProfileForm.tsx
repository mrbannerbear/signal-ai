"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type Profile } from "@/app/schemas/profiles.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTransition } from "react";
import { toast } from "sonner";
import { Globe, Loader2, MapPin } from "lucide-react";
import { createProfileAction, updateProfileAction } from "@/app/actions/profiles";
import { ExperienceSection } from "./ExperienceSection";
import { SkillsSection } from "./SkillSection";

interface ProfileFormProps {
  initialData?: Partial<Profile> & { id: string };
  userId: string;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

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

  async function onSubmit(values: Profile) {
    startTransition(async () => {
      let result;
      
      if (initialData?.id) {
        result = await updateProfileAction(initialData.id, values);
      } else {
        result = await createProfileAction(values);
      }

      if (result.success) {
        toast.success("Profile saved successfully");
      } else {
        toast.error(result.message || "Failed to save profile");
        console.error(result.errors);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        
        {/* SECTION 1: IDENTITY */}
        <div className="grid gap-6 p-8 border rounded-3xl bg-card shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Identity & Persona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="headline" render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl><Input placeholder="e.g. Fullstack Developer" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Bio</FormLabel>
              <FormControl><Textarea className="min-h-25" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* SECTION 2: LINKS & LOCATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Location</FormLabel>
              <FormControl><Input placeholder="New York, NY" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2"><Globe className="w-4 h-4"/> Portfolio</FormLabel>
              <FormControl><Input placeholder="https://..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">LinkedIn</FormLabel>
              <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* SECTION 3: SKILLS (Dynamic) */}
        <SkillsSection control={form.control} />

        {/* SECTION 4: EXPERIENCE (Dynamic) */}
        <ExperienceSection control={form.control} />

        {/* STICKY FOOTER ACTION */}
        <div className="flex flex-col gap-4 pt-6 border-t">
          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full h-14 text-lg font-black rounded-2xl uppercase tracking-tight"
          >
            {isPending ? (
              <><Loader2 className="mr-2 animate-spin" /> Calibrating Signal...</>
            ) : (
              "Save"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground italic">
            Saving will re-calculate your match scores across all active job postings.
          </p>
        </div>
      </form>
    </Form>
  );
}