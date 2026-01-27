// components/profile/EducationSection.tsx
"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EducationSection({ control }: { control: Control<any> }) {
  const { fields, append, remove } = useFieldArray({ control, name: "education" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="w-5 h-5"/> Education
        </h2>
        <Button type="button" variant="outline" size="sm" onClick={() => append({ institution: "", degree: "" })}>
          <Plus className="w-4 h-4 mr-2" /> Add School
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-xl relative grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2" onClick={() => remove(index)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>

          <FormField control={control} name={`education.${index}.institution`} render={({ field }) => (
            <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
          )} />
          
          <FormField control={control} name={`education.${index}.degree`} render={({ field }) => (
            <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
          )} />
        </div>
      ))}
    </div>
  );
}