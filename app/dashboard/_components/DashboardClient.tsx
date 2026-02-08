"use client";

import type { UserInsights, AnalysisSummaryData } from "@/actions/insights/types";
import { regenerateInsights } from "@/actions/insights";
import { useState, useTransition } from "react";
import { RefreshCw, TrendingUp, Briefcase, AlertTriangle, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FitScoreChart from "./charts/FitScoreChart";
import RiskLevelChart from "./charts/RiskLevelChart";
import CompanyScoreChart from "./charts/CompanyScoreChart";

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
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            Welcome back, {userName}
          </h1>
          <p className="text-slate-500 mt-1">Your career insights at a glance</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isPending}
          variant="outline"
          className="rounded-full font-semibold border-slate-200 hover:bg-slate-50 gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Refreshing..." : "Refresh Insights"}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
          <XCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {analyses.length === 0 && !error && (
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No analyses yet</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Start by analyzing a job to see how well it matches your profile. Your insights will appear here.
          </p>
          <Link href="/dashboard/jobs">
            <Button className="rounded-full font-semibold bg-indigo-600 hover:bg-indigo-700">
              Browse Jobs
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      {analyses.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Average Fit Score */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Avg Fit Score</span>
            </div>
            <p className="text-3xl font-black text-slate-900">
              {insights?.average_fit_score ? `${Math.round(insights.average_fit_score)}%` : "—"}
            </p>
          </div>

          {/* Jobs Analyzed */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <Briefcase className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Jobs Analyzed</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{analyses.length}</p>
          </div>

          {/* Good Matches */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Low Risk</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{riskCounts.low}</p>
          </div>

          {/* High Risk */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">High Risk</span>
            </div>
            <p className="text-3xl font-black text-slate-900">{riskCounts.high}</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      {analyses.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FitScoreChart analyses={analyses} />
          <RiskLevelChart analyses={analyses} />
          <CompanyScoreChart analyses={analyses} />
        </div>
      )}

      {/* AI Summary */}
      {insights?.overall_summary && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-1 rounded-full bg-indigo-500" />
            Career Insights
          </h3>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg">
            {insights.overall_summary}
          </p>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      {((insights?.aggregated_strengths?.length ?? 0) > 0 || (insights?.aggregated_weaknesses?.length ?? 0) > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          {insights?.aggregated_strengths && insights.aggregated_strengths.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 rounded-full bg-emerald-500" />
                Top Strengths
              </h3>
              <ul className="space-y-2">
                {insights.aggregated_strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {insights?.aggregated_weaknesses && insights.aggregated_weaknesses.length > 0 && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 rounded-full bg-amber-500" />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {insights.aggregated_weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-600">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recent Analyses */}
      {analyses.length > 0 && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-8 h-1 rounded-full bg-slate-400" />
              Recent Analyses
            </h3>
            <Link href="/dashboard/jobs?analysis=true" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {analyses.slice(0, 5).map((a) => (
              <Link
                key={a.job_id}
                href={`/dashboard/jobs/${a.job_id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">{a.job_title}</h4>
                  <p className="text-sm text-slate-500">{a.company}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {a.overall_fit_score !== null && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      a.overall_fit_score >= 70 
                        ? "bg-emerald-100 text-emerald-700" 
                        : a.overall_fit_score >= 40 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-red-100 text-red-700"
                    }`}>
                      {Math.round(a.overall_fit_score)}%
                    </span>
                  )}
                  {a.risk_level && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      a.risk_level === "low" 
                        ? "bg-green-100 text-green-700" 
                        : a.risk_level === "medium" 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-red-100 text-red-700"
                    }`}>
                      {a.risk_level}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
