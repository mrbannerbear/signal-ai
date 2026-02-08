"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { AnalysisSummaryData } from "@/actions/insights/types";

interface Props {
  analyses: AnalysisSummaryData[];
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

export default function CompanyScoreChart({ analyses }: Props) {
  // Group by company and calculate average
  const companyMap = new Map<string, { total: number; count: number }>();
  analyses.forEach((a) => {
    if (a.overall_fit_score !== null) {
      const existing = companyMap.get(a.company) || { total: 0, count: 0 };
      existing.total += a.overall_fit_score;
      existing.count += 1;
      companyMap.set(a.company, existing);
    }
  });

  const data = Array.from(companyMap.entries())
    .map(([company, { total, count }]) => ({
      name: company.length > 15 ? company.slice(0, 15) + "…" : company,
      score: Math.round(total / count),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-1 rounded-full bg-emerald-500" />
        Top Companies by Fit
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              formatter={(value: number) => [`${value}%`, "Fit Score"]}
            />
            <Bar dataKey="score" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getScoreColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
