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
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="bg-indigo-50 text-indigo-600 hover:text-indigo-600 hover:bg-indigo-100 border-indigo-200"
          onClick={() =>
            append({
              companyName: "",
              role: "",
              startDate: new Date(),
              endDate: null,
              isCurrent: false,
              description: "",
              location: "",
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Add Position
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const isCurrent = watchedExperience?.[index]?.isCurrent;

          return (
            <Card
              key={field.id}
              className="relative border-muted-foreground/20"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <CardContent className="p-4 md:p-6 grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name={`experience.${index}.companyName`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`experience.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <FormField
                    control={control}
                    name={`experience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date*</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
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
                    name={`experience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isCurrent ? "opacity-30" : ""}>
                          End Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            disabled={isCurrent}
                            className={
                              isCurrent ? "bg-muted cursor-not-allowed" : ""
                            }
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

                  <FormField
                    control={control}
                    name={`experience.${index}.isCurrent`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 pb-3 md:col-span-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                control
                                  .register(`experience.${index}.endDate`)
                                  .onChange(null);
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium">
                          I currently work here
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name={`experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-24" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
