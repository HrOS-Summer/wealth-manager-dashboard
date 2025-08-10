import { NextResponse } from "next/server";
import { holdings as raw } from "@/lib/data";
import {
  computePortfolioTotals,
  findTopAndWorst,
  computeDiversificationScore,
  computeRiskLevel,
  round2,
} from "@/lib/calc";
import { validateHolding } from "@/lib/validate";
import type { SummaryResponse } from "@/lib/types";

// GET handler to return a summary of the portfolio
export async function GET() {
  const bad = raw.filter((h) => !validateHolding(h).ok);
  if (bad.length) {
    return NextResponse.json({ error: "Data invalid" }, { status: 500 });
  }
  
  const totals = computePortfolioTotals(raw);
  const totalGainLossPercent =
    totals.totalInvested === 0 ? 0 : (totals.totalGainLoss / totals.totalInvested) * 100;

  const { top, worst } = findTopAndWorst(raw);
  const diversificationScore = computeDiversificationScore(raw);
  const riskLevel = computeRiskLevel(raw);

  const payload: SummaryResponse = {
    totalValue: round2(totals.totalValue),
    totalInvested: round2(totals.totalInvested),
    totalGainLoss: round2(totals.totalGainLoss),
    totalGainLossPercent: round2(totalGainLossPercent),
    topPerformer: top
      ? { symbol: top.symbol, name: top.name, gainPercent: round2(top.gainLossPercent * 100) }
      : null,
    worstPerformer: worst
      ? { symbol: worst.symbol, name: worst.name, gainPercent: round2(worst.gainLossPercent * 100) }
      : null,
    diversificationScore,
    riskLevel,
    numberOfHoldings: totals.count,
  };
  
  return NextResponse.json(payload);
}
