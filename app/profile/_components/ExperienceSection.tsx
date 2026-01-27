"use client";

import { useFieldArray, Control } from "react-hook-form";
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
import { Plus, Trash2 } from "lucide-react";
import { Profile } from "@/app/schemas/profiles.schema";

interface ExperienceSectionProps {
  // add isCurrent to control if endDate is disabled
  control: Control<Profile>;
}

export function ExperienceSection({ control }: ExperienceSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              companyName: "",
              role: "",
              location: "",
              startDate: new Date(),
              description: "",
              position: fields.length,
              // isCurrent: false,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Position
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card
            key={field.id}
            className="relative group overflow-hidden border-muted-foreground/20"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <CardContent className="p-6 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                {/* Company */}
                <FormField
                  control={control}
                  name={`experience.${index}.companyName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Acme Corp" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role */}
                <FormField
                  control={control}
                  name={`experience.${index}.role`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Senior Engineer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={control}
                  name={`experience.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.valueAsDate;
                            if (date) field.onChange(date);
                          }}
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
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.valueAsDate;
                            field.onChange(date || null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
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
                      <Textarea
                        {...field}
                        placeholder="What did you build? What was the impact?"
                        className="min-h-25"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        {fields.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/20">
            No experience added yet. Add your past roles to improve AI matching.
          </div>
        )}
      </div>
    </div>
  );
}
