"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { AnalysisSummaryData } from "@/actions/insights/types";

interface Props {
  analyses: AnalysisSummaryData[];
}

const RISK_CONFIG = {
  low: { color: "#22c55e", label: "Low" },
  medium: { color: "#f59e0b", label: "Medium" },
  high: { color: "#ef4444", label: "High" },
};

export default function RiskLevelChart({ analyses }: Props) {
  const counts = { low: 0, medium: 0, high: 0 };
  analyses.forEach((a) => {
    if (a.risk_level) counts[a.risk_level]++;
  });

  const data = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([level, count]) => ({
      name: RISK_CONFIG[level as keyof typeof RISK_CONFIG].label,
      value: count,
      color: RISK_CONFIG[level as keyof typeof RISK_CONFIG].color,
    }));

  if (data.length === 0) return null;

  const total = analyses.length;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-1 rounded-full bg-amber-500" />
        Risk Distribution
      </h3>
      <div className="h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              formatter={(value: number) => [`${value} jobs`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-black text-slate-900">{total}</p>
            <p className="text-xs text-slate-500">total</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-sm">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
