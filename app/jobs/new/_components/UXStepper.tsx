"use client";

import { LinkIcon, Sparkles, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: 1,
    label: "Paste Source",
    desc: "URL or Raw Text",
    icon: <LinkIcon className="w-3 h-3" />,
  },
  {
    step: 2,
    label: "Extract Intel",
    desc: "AI structures data",
    icon: <Sparkles className="w-3 h-3" />,
  },
  {
    step: 3,
    label: "Refine & Save",
    desc: "Start the analysis",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
];

export function UXStepper() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {steps.map((item) => (
        <div
          key={item.step}
          className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-2xl border border-border/50"
        >
          <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
            {item.step}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-tight leading-none mb-1">
              {item.label}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
