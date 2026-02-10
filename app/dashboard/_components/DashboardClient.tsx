"use client";

import type { UserInsights, AnalysisSummaryData } from "@/actions/insights/types";
import { regenerateInsights } from "@/actions/insights";
import { useState, useTransition } from "react";
import { RefreshCw, TrendingUp, Briefcase, AlertTriangle, CheckCircle, XCircle, Sparkles, Plus, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import FitScoreChart from "./charts/FitScoreChart";
import RiskLevelChart from "./charts/RiskLevelChart";

interface DashboardClientProps {
  userName: string;
  insights: UserInsights | null;
  analyses: AnalysisSummaryData[];
  insightsError: string | null;
  analysesError: string | null;
}

export default function DashboardClient({
  userName,
  insights: initialInsights,
  analyses,
  insightsError,
  analysesError,
}: DashboardClientProps) {
  const [insights, setInsights] = useState(initialInsights);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(insightsError || analysesError);

  const handleRefresh = () => {
    setError(null);
    startTransition(async () => {
      const result = await regenerateInsights(false);
      if (result.error) {
        setError(result.error);
      } else if (result.insights) {
        setInsights(result.insights);
      }
    });
  };

  // Calculate stats
  const riskCounts = { low: 0, medium: 0, high: 0 };
  analyses.forEach((a) => {
    if (a.risk_level) riskCounts[a.risk_level]++;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 md:p-8 animate-in fade-in duration-500 font-sans">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">Your career intelligence dashboard.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
             <Button
              asChild
              className="rounded-xl shadow-sm bg-zinc-900 hover:bg-zinc-800 text-white font-semibold h-11 px-5"
            >
              <Link href="/dashboard/jobs/new">
                <Plus className="w-4 h-4 mr-2" /> New Analysis
              </Link>
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={isPending}
              variant="outline"
              className="rounded-xl font-medium border-border/60 hover:bg-muted h-11 px-4 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
              {isPending ? "Refreshing..." : "Refresh Data"}
            </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="bg-red-50/50 border-red-200 shadow-none rounded-xl">
            <CardContent className="p-4 flex items-center gap-3 text-red-700">
                <XCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
            </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {analyses.length === 0 && !error && (
        <Card className="bg-card rounded-xl border-border/40 shadow-sm text-center py-16">
            <CardContent className="flex flex-col items-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">No analyses yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Start by analyzing a job description to unlock insights about your profile fit and interview risks.
              </p>
              <Link href="/dashboard/jobs/new">
                <Button size="lg" className="rounded-xl font-bold bg-zinc-900 text-white hover:bg-zinc-800 px-8">
                  Analyze Your First Job
                </Button>
              </Link>
            </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Average Fit Score */}
          <Card className="rounded-xl border-border/40 shadow-sm hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Avg Fit Score</span>
                </div>
                <p className="text-3xl font-bold text-foreground tracking-tight font-mono">
                {insights?.average_fit_score ? `${Math.round(insights.average_fit_score)}%` : "—"}
                </p>
            </CardContent>
          </Card>

          {/* Jobs Analyzed */}
          <Card className="rounded-xl border-border/40 shadow-sm hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                    <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Jobs Analyzed</span>
                </div>
                <p className="text-3xl font-bold text-foreground tracking-tight font-mono">{analyses.length}</p>
            </CardContent>
          </Card>

          {/* Low Risk */}
          <Card className="rounded-xl border-border/40 shadow-sm hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                    <CheckCircle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Low Risk Matches</span>
                </div>
                <p className="text-3xl font-bold text-foreground tracking-tight font-mono">{riskCounts.low}</p>
            </CardContent>
          </Card>

          {/* High Risk */}
          <Card className="rounded-xl border-border/40 shadow-sm hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-muted rounded-lg text-muted-foreground">
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">High Risk Matches</span>
                </div>
                <p className="text-3xl font-bold text-foreground tracking-tight font-mono">{riskCounts.high}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Charts Grid */}
            {analyses.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                <FitScoreChart analyses={analyses} />
                <RiskLevelChart analyses={analyses} />
                </div>
            )}

            {/* Recent Analyses List */}
            {analyses.length > 0 && (
                <Card className="rounded-xl border-border/40 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
                        <CardTitle className="text-xl font-bold flex items-center gap-2 tracking-tight">
                             Recent Activity
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                             <Link href="/dashboard/jobs?analysis=true" className="flex items-center gap-1">
                                View all <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-1 pt-4">
                        {analyses.slice(0, 5).map((a) => (
                        <Link
                            key={a.job_id}
                            href={`/dashboard/jobs/${a.job_id}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                    {a.job_title}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    {a.company}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                            {a.overall_fit_score !== null && (
                                <Badge variant="outline" className={`font-mono font-bold border-0 ${
                                a.overall_fit_score >= 70 
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                    : a.overall_fit_score >= 40 
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" 
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                {Math.round(a.overall_fit_score)}% Fit
                                </Badge>
                            )}
                            </div>
                        </Link>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>

        <div className="space-y-6">
             {/* AI Summary Side Widget */}
             {insights?.overall_summary && (
                <Card className="rounded-xl border-border/40 shadow-sm bg-muted/20">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2 tracking-tight">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Career Pulse
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {insights.overall_summary}
                        </p>
                    </CardContent>
                </Card>
            )}
            
            {/* Quick Actions Card */}
            <Card className="rounded-xl border-border/40 shadow-sm">
                <CardHeader className="border-b border-border/40 pb-3">
                    <CardTitle className="text-base font-semibold tracking-tight">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 pt-4">
                    <Button variant="outline" className="w-full justify-start rounded-xl h-10 font-medium border-border/60 hover:bg-muted" asChild>
                         <Link href="/dashboard/profile">
                            <User className="w-4 h-4 mr-2 text-muted-foreground" />
                            Update Profile
                         </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl h-10 font-medium border-border/60 hover:bg-muted" asChild>
                         <Link href="/dashboard/jobs/new">
                            <Plus className="w-4 h-4 mr-2 text-muted-foreground" />
                            New Job Analysis
                         </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
