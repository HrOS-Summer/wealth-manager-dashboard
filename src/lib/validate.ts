import { Holding, TimelinePoint } from "./types";

/**
 * Validates a single Holding object to ensure all required fields are present and of the correct type.
 */
export function validateHolding(h: Holding) {
  const errors: string[] = [];
  if (!h.symbol || typeof h.symbol !== "string") errors.push("symbol");
  if (!h.name || typeof h.name !== "string") errors.push("name");
  if (!Number.isFinite(h.quantity) || h.quantity < 0) errors.push("quantity");
  if (!Number.isFinite(h.avgPrice) || h.avgPrice < 0) errors.push("avgPrice");
  if (!Number.isFinite(h.currentPrice) || h.currentPrice < 0)
    errors.push("currentPrice");
  if (!h.sector || typeof h.sector !== "string") errors.push("sector");
  if (!h.marketCap || typeof h.marketCap !== "string")
    errors.push("marketCap");
  return errors.length ? { ok: false, errors } : { ok: true };
}

/**
 * Validates a single TimelinePoint object.
 */
export function validatePoint(p: TimelinePoint) {
  const errors: string[] = [];
  if (!p.date || typeof p.date !== "string") errors.push("date");
  for (const k of ["portfolio", "nifty50", "gold"] as const) {
    if (!Number.isFinite(p[k]) || p[k] < 0) errors.push(k);
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}