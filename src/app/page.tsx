"use client";

import React, { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import Section from "@/components/layout/Section";
import StatCard from "@/components/layout/StatCard";
import SectorPie from "@/components/charts/SectorPie";
import MarketCapPie from "@/components/charts/MarketCapPie";
import PerformanceLine from "@/components/charts/PerformanceLine";
import HoldingsTable from "@/components/table/HoldingsTable";
import ErrorBlock from "@/components/layout/ErrorBlock";
import LoadingBlock from "@/components/layout/LoadingBlock";
import { Banknote, TrendingUp, PieChart as PieIcon, Layers } from "lucide-react";
import { formatCurrency, pct, gainColor } from "@/lib/format";
import type {
  AllocationResponse,
  HoldingComputed,
  PerformanceResponse,
  SummaryResponse,
} from "@/lib/types";
import TopPerformers from "@/components/layout/TopPerformers";

// Helper component for the Metric Cards in the Performance section
function MetricCard({ title, data, color }: { title: string; data: Record<string, number>; color: string }) {
  return (
    <div className="rounded-lg border p-4 bg-white">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className={`flex gap-4 mt-2 ${color}`}>
        <div>1M: {data?.["1month"] != null ? `${data["1month"].toFixed(2)}%` : "-"}</div>
        <div>3M: {data?.["3months"] != null ? `${data["3months"].toFixed(2)}%` : "-"}</div>
        <div>1Y: {data?.["1year"] != null ? `${data["1year"].toFixed(2)}%` : "-"}</div>
      </div>
    </div>
  );
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<HoldingComputed[]>([]);
  const [allocation, setAllocation] = useState<AllocationResponse>({ bySector: {}, byMarketCap: {} });
  const [performance, setPerformance] = useState<PerformanceResponse>({
    timeline: [],
    returns: {
      portfolio: {} as any,
      nifty50: {} as any,
      gold: {} as any
    }
  });
  const [summary, setSummary] = useState<SummaryResponse | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [h, a, p, s] = await Promise.all([
        fetch("/api/portfolio/holdings").then(r => r.json()),
        fetch("/api/portfolio/allocation").then(r => r.json()),
        fetch("/api/portfolio/performance").then(r => r.json()),
        fetch("/api/portfolio/summary").then(r => r.json()),
      ]);

      if (h.error || a.error || p.error || s.error) {
        throw new Error(h.error || a.error || p.error || s.error || "Failed");
      }

      setHoldings(h);
      setAllocation(a);
      setPerformance(p);
      setSummary(s);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const cards = [
    { 
      icon: Banknote, 
      label: "Total Portfolio Value", 
      value: summary ? formatCurrency(summary.totalValue)! : "-", 
      emphasize: true 
    },
    { 
      icon: TrendingUp, 
      label: "Total Gain/Loss", 
      value: summary ? formatCurrency(summary.totalGainLoss)! : "-", 
      delta: summary?.totalGainLossPercent ?? null 
    },
    { 
      icon: PieIcon, 
      label: "Portfolio Performance %", 
      value: summary ? pct(summary.totalGainLossPercent) : "-" 
    },
    { 
      icon: Layers, 
      label: "Number of Holdings", 
      value: summary?.numberOfHoldings ?? 0 
    },
  ];

  return (
    <PageShell>
      {error ? (
        <ErrorBlock message={error} onRetry={fetchAll} />
      ) : loading ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {cards.map((c, i) => (
              <StatCard key={i} {...c} />
            ))}
          </div>

          <Section title="Asset Allocation" subtitle="Distribution by sector and market cap">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">By Sector</div>
                <SectorPie data={allocation.bySector} />
              </div>
              <div>
                <div className="text-sm font-medium mb-2">By Market Cap</div>
                <MarketCapPie data={allocation.byMarketCap} />
              </div>
            </div>
          </Section>

          <Section title="Holdings" subtitle="Sortable and searchable holdings table">
            <HoldingsTable data={holdings} />
          </Section>

          <Section title="Performance Comparison" subtitle="Portfolio vs Nifty 50 vs Gold">
            <PerformanceLine timeline={performance.timeline} />
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <MetricCard title="Portfolio" data={performance.returns.portfolio} color="text-blue-600" />
              <MetricCard title="Nifty 50" data={performance.returns.nifty50} color="text-green-600" />
              <MetricCard title="Gold" data={performance.returns.gold} color="text-amber-600" />
            </div>
          </Section>

          <Section title="Top Performers & Insights" subtitle="Best/worst performers, diversification score, risk level">
            <TopPerformers summary={summary!} />
          </Section>
        </>
      )}
    </PageShell>
  );
}
