"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { AnalysisSummaryData } from "@/actions/insights/types";

interface Props {
  analyses: AnalysisSummaryData[];
}

const RANGES = [
  { label: "0-40", min: 0, max: 40, color: "#ef4444" },   // Red-500
  { label: "41-60", min: 41, max: 60, color: "#d97706" }, // Amber-600
  { label: "61-80", min: 61, max: 80, color: "#059669" }, // Emerald-600
  { label: "81-100", min: 81, max: 100, color: "#10b981" }, // Emerald-500
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
    <div className="bg-card rounded-xl p-6 border border-border/40 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 tracking-tight">
        <span className="w-1 h-5 rounded-full bg-emerald-500" />
        Fit Score Distribution
      </h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: "#78716c", fontWeight: 500 }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
            />
            <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 11, fill: "#78716c" }} 
                axisLine={false} 
                tickLine={false} 
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: "8px", 
                border: "none", 
                backgroundColor: "#18181b", 
                color: "#fff",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
              }}
              itemStyle={{ color: "#fff", fontSize: "12px", padding: 0 }}
              labelStyle={{ display: "none" }}
              cursor={{ fill: "#f5f5f4" }}
              formatter={(value: number) => [<span key="val" className="font-mono font-bold">{value} jobs</span>, ""]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
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
