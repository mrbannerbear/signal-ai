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
import { useRouter } from "next/navigation";
import { SkillsSection } from "./SkillSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";

export function ProfileForm({ initialData } : { initialData?: Profile }) {
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

  async function onSubmit(values: Profile) {
    startTransition(async () => {
      const result = initialData?.id 
        ? await updateProfileAction(initialData.id, values)
        : await createProfileAction(values);

      if (result.success) {
        toast.success("Profile saved!");
        router.push("/dashboard/jobs");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to save profile");
        console.error(result.errors);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 pb-10">
        
        {/* IDENTITY */}
        <div className="grid gap-6 p-8 border rounded-3xl bg-card shadow-sm">
          <h2 className="text-xl font-bold">Identity & Persona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="headline" render={({ field }) => (
            <FormItem><FormLabel>Headline</FormLabel><FormControl><Input placeholder="e.g. Fullstack Developer" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="bio" render={({ field }) => (
            <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea className="min-h-25" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem><FormLabel className="flex gap-2"><MapPin className="w-4 h-4"/> Location</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="portfolioUrl" render={({ field }) => (
            <FormItem><FormLabel className="flex gap-2"><Globe className="w-4 h-4"/> Portfolio</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="linkedinUrl" render={({ field }) => (
            <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
          )} />
        </div>

        <SkillsSection control={form.control} />

        <ExperienceSection control={form.control} />
        
        <EducationSection control={form.control} />

        <Button type="submit" disabled={isPending} className="w-full h-14 text-lg font-black rounded-2xl uppercase">
          {isPending ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}