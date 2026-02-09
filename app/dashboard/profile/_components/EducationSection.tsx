// components/profile/EducationSection.tsx
"use client";

import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EducationSection({ control }: { control: Control<any> }) {
  const { fields, append, remove } = useFieldArray({ control, name: "education" });

  return (
    <div className="space-y-6 p-6 md:p-8 border border-zinc-200 rounded-xl bg-card shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600"/> Education
          </h2>
          <p className="text-sm text-zinc-500">Your academic background.</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="bg-zinc-50 text-zinc-900 border-zinc-200 hover:bg-zinc-100 rounded-lg shadow-sm"
          onClick={() => append({ institution: "", degree: "" })}
        >
          <Plus className="w-4 h-4 mr-2" /> Add School
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="relative p-4 md:p-6 bg-zinc-50/50 border border-zinc-200 rounded-xl">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg" 
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={control} name={`education.${index}.institution`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700">Institution</FormLabel>
                    <FormControl><Input placeholder="e.g. Stanford University" {...field} className="bg-white rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={control} name={`education.${index}.degree`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-700">Degree</FormLabel>
                    <FormControl><Input placeholder="e.g. Master's in Computer Science" {...field} className="bg-white rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`education.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700">Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="bg-white rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                            value={
                              field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(e.target.valueAsDate)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`education.${index}.graduationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700">Graduation Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="bg-white rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                            value={
                              field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(e.target.valueAsDate)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
             <p className="text-zinc-500 text-sm">No education added yet.</p>
             <Button variant="link" onClick={() => append({ institution: "", degree: "" })} className="text-emerald-600">
               Add education
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}