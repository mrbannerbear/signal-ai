"use client";

import { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { Profile } from "@/schemas/profiles.schema";

export function SkillsSection({ control }: { control: Control<Profile> }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const [currentSkill, setCurrentSkill] = useState("");

  const addSkill = () => {
    if (currentSkill.trim()) {
      // Check for duplicates
      if (!fields.some(f => f.name.toLowerCase() === currentSkill.toLowerCase())) {
        append({ name: currentSkill.trim(), level: "Intermediate" });
      }
      setCurrentSkill("");
    }
  };

  return (
    <div className="space-y-4 p-5 md:p-6 border rounded-2xl bg-card shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground">Technical Arsenal</h2>
        <p className="text-xs text-muted-foreground">Add skills the AI should use to rank you.</p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="e.g. React, Python, AWS"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          className="rounded-xl"
        />
        <Button 
          type="button" 
          onClick={addSkill} 
          size="icon" 
          className="rounded-xl shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {fields.map((field, index) => (
          <Badge 
            key={field.id} 
            variant="secondary" 
            className="pl-3 pr-1 py-1 gap-1 text-sm border-primary/20 bg-primary/5 text-primary rounded-lg group"
          >
            {field.name}
            <button
              type="button"
              onClick={() => remove(index)}
              className="hover:bg-destructive hover:text-destructive-foreground rounded-md p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        {fields.length === 0 && (
          <p className="text-xs italic text-muted-foreground">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}