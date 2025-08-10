"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Props = { data: Record<string, { value: number; percentage: number; count?: number }> };
const COLORS = ["#0ea5e9", "#22c55e", "#f97316"];

export default function MarketCapPie({ data }: Props) {
  const pie = Object.entries(data || {}).map(([name, val]) => ({ name, value: val.value, percentage: val.percentage }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={200} className="sm:h-280">
        <PieChart>
          <Pie
            data={pie}
            dataKey="value"
            nameKey="name"
            innerRadius={40} // Smaller inner radius for mobile
            outerRadius={80} // Smaller outer radius for mobile
            paddingAngle={2}
            label={false}
            labelLine={false}
          >
            {pie.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number, n, { payload }) => [`₹${v.toLocaleString("en-IN")}`, `${payload.name} (${payload.percentage.toFixed(1)}%)`]} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Custom, responsive legend below the chart */}
      <div className="flex flex-col items-center justify-center gap-y-2 text-sm mt-4 md:flex-wrap md:flex-row md:gap-x-6">
        {pie.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{entry.name} ({entry.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}