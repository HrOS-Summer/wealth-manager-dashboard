import { NextResponse } from "next/server";
import { historicalPerformance as raw } from "@/lib/data";
import { computeReturns } from "@/lib/calc";
import { validatePoint } from "@/lib/validate";
import type { PerformanceResponse } from "@/lib/types";

// GET handler to return historical performance and computed returns
export async function GET() {
  const bad = raw.filter((p) => !validatePoint(p).ok);
  if (bad.length) {
    return NextResponse.json({ error: "Data invalid" }, { status: 500 });
  }

  // Sort timeline by date to ensure correct order for return calculations
  const timeline = [...raw].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const returns = computeReturns(timeline);
  
  const payload: PerformanceResponse = { timeline, returns } as PerformanceResponse;
  
  return NextResponse.json(payload);
}