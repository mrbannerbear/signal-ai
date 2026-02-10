"use client";

import { useFieldArray, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ExperienceSection({ control }: { control: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const watchedExperience = useWatch({ control, name: "experience" });

  return (
    <div className="space-y-6 p-6 md:p-8 border border-zinc-200 rounded-xl bg-card shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-zinc-900">Work Experience</h2>
          <p className="text-sm text-zinc-500">Your professional journey and roles.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="bg-zinc-50 text-zinc-900 border-zinc-200 hover:bg-zinc-100 rounded-lg shadow-sm"
          onClick={() =>
            append({
              company_name: "",
              role: "",
              start_date: new Date(),
              end_date: null,
              is_current: false,
              description: "",
              location: "",
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Add 
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const isCurrent = watchedExperience?.[index]?.is_current;

          return (
            <div
              key={field.id}
              className="relative p-4 md:p-6 bg-zinc-50/50 border border-zinc-200 rounded-xl"
            >
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
                  <FormField
                    control={control}
                    name={`experience.${index}.company_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700">Company</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Acme Inc." className="bg-white rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`experience.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700">Role</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Senior Developer" className="bg-white rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <FormField
                    control={control}
                    name={`experience.${index}.start_date`}
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
                    name={`experience.${index}.end_date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isCurrent ? "opacity-30 text-zinc-400" : "text-zinc-700"}>
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isCurrent}
                            className={`bg-white rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                              isCurrent ? "bg-zinc-100 opacity-50 cursor-not-allowed" : ""
                            }`}
                            value={
                              !isCurrent && field.value instanceof Date
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

                  <div className="pb-3 md:pb-3">
                     <FormField
                      control={control}
                      name={`experience.${index}.is_current`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-white rounded-md"
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (checked) {
                                  control
                                    .register(`experience.${index}.end_date`)
                                    .onChange(null);
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium text-zinc-700 cursor-pointer">
                            I currently work here
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-700">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Key achievements and responsibilities..." className="bg-white min-h-24 rounded-lg border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          );
        })}
        
        {fields.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
             <p className="text-zinc-500 text-sm">No experience added yet.</p>
             <Button variant="link" onClick={() => append({ company_name: "", role: "", start_date: new Date(), end_date: null, is_current: false, description: "", location: "" })} className="text-emerald-600">
               Add your first role
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
