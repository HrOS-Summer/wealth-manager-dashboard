"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import dayjs from "dayjs";
import type { TimelinePoint } from "@/lib/types";

export default function PerformanceLine({ timeline }: { timeline: TimelinePoint[] }) {
  const data = (timeline || []).map((t) => ({
    date: dayjs(t.date).format("MMM YYYY"),
    Portfolio: t.portfolio,
    Nifty50: t.nifty50,
    Gold: t.gold,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(v) => v.toLocaleString("en-IN")} />
        <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
        <Legend />
        <Line type="monotone" dataKey="Portfolio" stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Nifty50" stroke="#16a34a" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Gold" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}