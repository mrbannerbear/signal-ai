"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { AnalysisSummaryData } from "@/actions/insights/types";

interface Props {
  analyses: AnalysisSummaryData[];
}

const RISK_CONFIG = {
  low: { color: "#059669", label: "Low" }, // Emerald-600
  medium: { color: "#d97706", label: "Medium" }, // Amber-600
  high: { color: "#dc2626", label: "High" }, // Red-600
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
    <div className="bg-card rounded-xl p-6 border border-border/40 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 tracking-tight">
        <span className="w-1 h-5 rounded-full bg-amber-500" />
        Risk Distribution
      </h3>
      <div className="flex-1 w-full min-h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#18181b",
                color: "#fff",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "#fff", fontSize: "12px", padding: 0 }}
              formatter={(value: number | undefined) => [<span key="val" className="font-mono font-bold">{value} jobs</span>, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground tracking-tight font-mono">{total}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">total</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-6">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground font-medium">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
