"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Link as LinkIcon } from "lucide-react";

export function URLTopBar() {
  return (
    <Card className="p-1.5 md:p-2 border-primary/20 bg-background/50 backdrop-blur-md sticky top-2 md:top-4 z-20 shadow-xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Paste job URL (LinkedIn, Indeed, Lever...)"
            className="pl-9 border-none bg-transparent focus-visible:ring-0 text-base md:text-lg w-full"
          />
        </div>
        <Button
          size="lg"
          className="rounded-full px-4 md:px-8 shadow-lg hover:shadow-primary/20 transition-all w-full sm:w-auto font-bold"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Scrape Job
        </Button>
      </div>
    </Card>
  );
}
