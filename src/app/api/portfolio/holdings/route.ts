import { NextResponse } from "next/server";
import { holdings as raw } from "@/lib/data";
import { computeHoldingMetrics, round2 } from "@/lib/calc";
import { validateHolding } from "@/lib/validate";
import type { HoldingComputed } from "@/lib/types";

// GET handler to return all holdings with computed metrics
export async function GET() {
  // Validate data on every request for production-level robustness
  const bad = raw.filter((h) => !validateHolding(h).ok);
  if (bad.length) {
    return NextResponse.json({ error: "Data invalid" }, { status: 500 });
  }

  // Compute additional metrics for each holding and format values
  const enriched: HoldingComputed[] = raw.map((h) => {
    const m = computeHoldingMetrics(h);
    return {
      ...h,
      value: round2(m.value),
      gainLoss: round2(m.gainLoss),
      gainLossPercent: round2(m.gainLossPercent * 100), // Convert to percentage
      avgPrice: round2(h.avgPrice),
      currentPrice: round2(h.currentPrice),
    };
  });
  
  return NextResponse.json(enriched);
}