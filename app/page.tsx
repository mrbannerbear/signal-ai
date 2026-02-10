import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "./lib/supabase/server";

export const metadata: Metadata = {
  title: "Signal AI – Career intelligence, amplified.",
  description:
    "Data-driven job analysis for the modern professional. Assess fit, identify gaps, and strategize your next move with precision.",
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <nav
          className="container-narrow h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity"
            aria-label="Signal AI Home"
          >
            <div className="size-6 bg-primary rounded-sm flex items-center justify-center text-primary-foreground">
              <Sparkles className="size-3.5" aria-hidden="true" />
            </div>
            <span>Signal AI</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="font-medium"
                asChild
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button size="sm" className="font-medium" asChild>
                <Link href="/auth">Get started</Link>
              </Button>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative border-b border-border/40 overflow-hidden"
          aria-labelledby="hero-title"
        >
          <div
            className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"
            aria-hidden="true"
          />

          <div className="container-narrow relative py-20 sm:py-32 lg:py-40">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/30 text-xs font-medium text-muted-foreground mb-6 backdrop-blur-sm">
                <span
                  className="flex size-2 rounded-full bg-emerald-500 animate-pulse"
                  aria-hidden="true"
                />
                <span>v2.0 Analysis Engine is live</span>
              </div>

              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.1]"
              >
                Career intelligence, <br />
                <span className="text-muted-foreground">amplified.</span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Stop guessing. Signal AI analyzes job postings against your
                unique profile to provide data-driven fit scores, skill gap
                detection, and strategic interview angles.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  size="xl"
                  className="font-medium px-8 shadow-sm group"
                  asChild
                >
                  <Link href="/auth" aria-label="Start job analysis">
                    Analyze a job
                    <ArrowRight
                      className="ml-2 size-4 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                <div className="text-sm text-muted-foreground px-2 flex items-center gap-2">
                  <Lock
                    className="size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  No credit card required · Private & secure
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid - Brutalist / Editorial */}
        <section
          className="border-b border-border/40 bg-muted/20"
          aria-labelledby="features-title"
        >
          <div className="container-narrow py-20 sm:py-24">
            <h2 id="features-title" className="sr-only">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border border-border rounded-xl bg-card overflow-hidden shadow-sm">
              {[
                {
                  title: "Precision Matching",
                  desc: "Our engine parses 50+ data points to calculate your exact fit score.",
                },
                {
                  title: "Skill Gap Detection",
                  desc: "Identify missing keywords and requirements before HR does.",
                },
                {
                  title: "Interview Strategy",
                  desc: "Get tailored talking points to turn weaknesses into strengths.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 hover:bg-muted/10 transition-colors group"
                >
                  <div className="size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="font-mono text-sm font-medium">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-foreground tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Analysis Preview Section */}
        <section
          className="py-24 sm:py-32 overflow-hidden"
          aria-labelledby="preview-title"
        >
          <div className="container-narrow">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-primary/5 text-primary text-xs font-medium mb-6">
                  <BarChart3 className="size-3.5" aria-hidden="true" />
                  <span>Live Preview</span>
                </div>
                <h2
                  id="preview-title"
                  className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-6"
                >
                  See what they see.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Recruiters spend 7 seconds on your resume. Signal AI gives you
                  the full picture in milliseconds. We simulate the ATS
                  screening process to show you exactly where you stand.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      icon: CheckCircle2,
                      text: "Keyword optimization check",
                      color: "text-emerald-600",
                    },
                    {
                      icon: AlertCircle,
                      text: "Missing requirements alert",
                      color: "text-amber-600",
                    },
                    {
                      icon: Sparkles,
                      text: "AI-generated improvement tips",
                      color: "text-primary",
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors"
                    >
                      <feature.icon
                        className={`size-5 ${feature.color} shrink-0 mt-0.5`}
                        aria-hidden="true"
                      />
                      <span className="text-foreground font-medium text-sm sm:text-base">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex gap-4">
                  <Button size="lg" asChild>
                    <Link href="/auth">Start free scan</Link>
                  </Button>
                </div>
              </div>

              {/* Report Card Visual */}
              <div className="relative" aria-hidden="true">
                <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-primary/5 to-transparent rounded-4xl blur-2xl opacity-50" />
                <div className="relative bg-card border border-border rounded-xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto rotate-1 hover:rotate-0 transition-transform duration-500 ease-out">
                  {/* Fake UI Header */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/40">
                    <div>
                      <div className="h-2 w-20 bg-muted rounded-full mb-2" />
                      <div className="h-3 w-32 bg-foreground/10 rounded-full" />
                    </div>
                    <div className="size-12 rounded-full border-4 border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-lg">
                      92%
                    </div>
                  </div>

                  {/* Fake UI Body */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <span>Profile Match</span>
                        <span>High</span>
                      </div>
                      <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3 items-center text-sm">
                        <div className="size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-foreground">
                          7/7 Key Skills Found
                        </span>
                      </div>
                      <div className="flex gap-3 items-center text-sm">
                        <div className="size-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                          <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-foreground">
                          Seniority Mismatch (Possible)
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg border border-border/40 mt-4">
                      <div className="h-2 w-24 bg-primary/20 rounded-full mb-3" />
                      <div className="space-y-2">
                        <div className="h-1.5 w-full bg-muted rounded-full" />
                        <div className="h-1.5 w-5/6 bg-muted rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-12">
        <div className="container-narrow flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <div className="size-4 bg-muted-foreground/20 rounded-sm" />
            <span>© 2026 Signal AI Inc.</span>
          </div>
          <nav
            className="flex gap-8 text-sm text-muted-foreground"
            aria-label="Footer navigation"
          >
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
