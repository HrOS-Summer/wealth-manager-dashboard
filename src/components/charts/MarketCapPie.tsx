"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Props = { data: Record<string, { value: number; percentage: number; count?: number }> };
const COLORS = ["#0ea5e9", "#22c55e", "#f97316"];

export default function MarketCapPie({ data }: Props) {
  const pie = Object.entries(data || {}).map(([name, val]) => ({ name, value: val.value, percentage: val.percentage }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={pie}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          label={(entry) => `${entry.name} (${entry.percentage.toFixed(1)}%)`}
          labelLine={false}
        >
          {pie.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number, n, { payload }) => [`₹${v.toLocaleString("en-IN")}`, payload.name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}