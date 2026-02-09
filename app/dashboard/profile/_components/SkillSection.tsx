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
    <div className="space-y-4 p-6 md:p-8 border border-zinc-200 rounded-xl bg-card shadow-xs">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-zinc-900">Technical Arsenal</h2>
        <p className="text-sm text-zinc-500">Add skills the AI should use to rank you.</p>
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
          className="rounded-lg bg-white border-zinc-200 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <Button 
          type="button" 
          onClick={addSkill} 
          size="icon" 
          className="rounded-lg shrink-0 bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {fields.map((field, index) => (
          <Badge 
            key={field.id} 
            variant="secondary" 
            className="pl-3 pr-1 py-1 gap-1 text-sm border-emerald-200 bg-emerald-50 text-emerald-900 rounded-md group hover:bg-emerald-100"
          >
            {field.name}
            <button
              type="button"
              onClick={() => remove(index)}
              className="hover:bg-red-500 hover:text-white rounded-sm p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        {fields.length === 0 && (
          <p className="text-xs italic text-zinc-400">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}