import { Holding, TimelinePoint } from "./types";

/**
 * Rounds a number to two decimal places.
 */
export const round2 = (x: number) => Math.round(x * 100) / 100;

/**
 * Safely multiplies two numbers, returning 0 if either is not a finite number.
 */
const safeMul = (a: number, b: number) =>
  Number.isFinite(a) && Number.isFinite(b) ? a * b : 0;

/**
 * Computes key financial metrics for a single holding.
 */
export function computeHoldingMetrics(h: Holding) {
  const value = safeMul(h.quantity, h.currentPrice);
  const invested = safeMul(h.quantity, h.avgPrice);
  const gainLoss = value - invested;
  const gainLossPercent = invested === 0 ? 0 : gainLoss / invested;
  return { value, invested, gainLoss, gainLossPercent };
}

/**
 * Computes total portfolio value, invested amount, and gain/loss.
 */
export function computePortfolioTotals(items: Holding[]) {
  return items.reduce(
    (a, h) => {
      const m = computeHoldingMetrics(h);
      a.totalValue += m.value;
      a.totalInvested += m.invested;
      a.totalGainLoss += m.gainLoss;
      a.count += 1;
      return a;
    },
    { totalValue: 0, totalInvested: 0, totalGainLoss: 0, count: 0 }
  );
}

/**
 * Groups an array of objects by a specified key.
 */
export function groupBy<T extends Record<string, any>>(
  items: T[],
  key: keyof T
) {
  return items.reduce<Record<string, T[]>>((acc, h) => {
    const k = (h[key] as string) || "Unknown";
    (acc[k] ||= []).push(h);
    return acc;
  }, {});
}

/**
 * Calculates portfolio allocation by a specified key (e.g., sector, marketCap).
 */
export function buildAllocation(items: Holding[], key: keyof Holding) {
  const groups = groupBy(items, key);
  const totals = computePortfolioTotals(items);
  const byKey: Record<string, { value: number; percentage: number }> = {};
  for (const k of Object.keys(groups)) {
    const value = groups[k].reduce(
      (s, h) => s + computeHoldingMetrics(h).value,
      0
    );
    const percentage = totals.totalValue === 0 ? 0 : value / totals.totalValue;
    byKey[k] = { value, percentage };
  }
  return byKey;
}

/**
 * Finds the top and worst performing holdings based on gain/loss percentage.
 */
export function findTopAndWorst(items: Holding[]) {
  if (!items.length) return { top: null, worst: null };
  const withPerf = items
    .map((h) => ({ ...h, ...computeHoldingMetrics(h) }))
    .sort((a, b) => b.gainLossPercent - a.gainLossPercent);
  return { top: withPerf[0], worst: withPerf[withPerf.length - 1] };
}

/**
 * Computes a diversification score for the portfolio.
 */
export function computeDiversificationScore(items: Holding[]) {
  const alloc = buildAllocation(items, "sector");
  const shares = Object.values(alloc).map((x) => x.percentage);
  if (!shares.length) return 0;
  const hhi = shares.reduce((s, p) => s + p * p, 0);
  const n = shares.length;
  const minHHI = 1 / n,
    maxHHI = 1;
  const normalized = (hhi - minHHI) / (maxHHI - minHHI);
  const score = 10 * (1 - normalized);
  return Math.max(0, Math.min(10, round2(score)));
}

/**
 * Determines the overall risk level of the portfolio based on diversification and losses.
 */
export function computeRiskLevel(items: Holding[]) {
  const alloc = buildAllocation(items, "sector");
  const shares = Object.values(alloc).map((x) => x.percentage);
  if (!shares.length) return "Unknown" as const;
  const hhi = shares.reduce((s, p) => s + p * p, 0);
  const lossCount = items.filter(
    (h) => computeHoldingMetrics(h).gainLoss < 0
  ).length;
  if (hhi > 0.25 || lossCount > items.length * 0.4) return "High";
  if (hhi > 0.18 || lossCount > items.length * 0.25) return "Moderate";
  return "Low";
}

/**
 * Computes historical returns for the portfolio and benchmarks over different periods.
 */
export function computeReturns(timeline: TimelinePoint[]) {
  if (!timeline.length)
    return {
      portfolio: {} as any,
      nifty50: {} as any,
      gold: {} as any,
    };
  const last = timeline.length - 1;
  const idx1 = Math.max(0, last - 1);
  const idx3 = Math.max(0, last - 3);
  const idx12 = Math.max(0, last - 12);
  const ret = (field: keyof TimelinePoint, fromIdx: number) => {
    const from = timeline[fromIdx][field] as number;
    const to = timeline[last][field] as number;
    return from === 0 ? 0 : ((to - from) / from) * 100;
  };
  const f2 = (x: number) => Math.round(x * 100) / 100;
  return {
    portfolio: {
      "1month": f2(ret("portfolio", idx1)),
      "3months": f2(ret("portfolio", idx3)),
      "1year": f2(ret("portfolio", idx12)),
    },
    nifty50: {
      "1month": f2(ret("nifty50", idx1)),
      "3months": f2(ret("nifty50", idx3)),
      "1year": f2(ret("nifty50", idx12)),
    },
    gold: {
      "1month": f2(ret("gold", idx1)),
      "3months": f2(ret("gold", idx3)),
      "1year": f2(ret("gold", idx12)),
    },
  };
}