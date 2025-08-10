import { NextResponse } from "next/server";
import { holdings as raw } from "@/lib/data";
import { buildAllocation, round2 } from "@/lib/calc";
import { validateHolding } from "@/lib/validate";
import type { AllocationResponse } from "@/lib/types";

// GET handler to return allocation data by sector and market cap
export async function GET() {
  const bad = raw.filter((h) => !validateHolding(h).ok);
  if (bad.length) {
    return NextResponse.json({ error: "Data invalid" }, { status: 500 });
  }

  const bySectorRaw = buildAllocation(raw, "sector");
  const byMarketCapRaw = buildAllocation(raw, "marketCap");

  const bySector: AllocationResponse["bySector"] = {};
  for (const k of Object.keys(bySectorRaw)) {
    const count = raw.filter((h) => h.sector === k).length;
    bySector[k] = {
      value: round2(bySectorRaw[k].value),
      percentage: round2(bySectorRaw[k].percentage * 100),
      count,
    };
  }

  const byMarketCap: AllocationResponse["byMarketCap"] = {};
  for (const k of Object.keys(byMarketCapRaw)) {
    const count = raw.filter((h) => h.marketCap === k).length;
    byMarketCap[k] = {
      value: round2(byMarketCapRaw[k].value),
      percentage: round2(byMarketCapRaw[k].percentage * 100),
      count,
    };
  }

  return NextResponse.json({ bySector, byMarketCap });
}