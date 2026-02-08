"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { AnalysisSummaryData } from "@/actions/insights/types";

interface Props {
  analyses: AnalysisSummaryData[];
}

const RANGES = [
  { label: "0-40", min: 0, max: 40, color: "#ef4444" },
  { label: "41-60", min: 41, max: 60, color: "#f59e0b" },
  { label: "61-80", min: 61, max: 80, color: "#22c55e" },
  { label: "81-100", min: 81, max: 100, color: "#10b981" },
];

export default function FitScoreChart({ analyses }: Props) {
  const data = RANGES.map((range) => ({
    name: range.label,
    count: analyses.filter(
      (a) => a.overall_fit_score !== null && a.overall_fit_score >= range.min && a.overall_fit_score <= range.max
    ).length,
    color: range.color,
  }));

  if (analyses.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-1 rounded-full bg-indigo-500" />
        Fit Score Distribution
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              formatter={(value: number) => [`${value} jobs`, "Count"]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
