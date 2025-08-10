export type MarketCap = "Large" | "Mid" | "Small" | string;

// Interface for a single holding as stored in the data source
export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  marketCap: MarketCap;
  exchange: string;
}

// Interface for a holding with computed metrics
export interface HoldingComputed extends Holding {
  value: number;
  gainLoss: number;
  gainLossPercent: number; // percent (e.g., 11.7)
}

// Interface for a single allocation entry
export interface AllocationEntry {
  value: number;
  percentage: number; // 0-100 in API response
  count?: number;
}

// Interface for the allocation API response
export interface AllocationResponse {
  bySector: Record<string, AllocationEntry>;
  byMarketCap: Record<string, AllocationEntry>;
}

// Interface for a single point in the historical timeline
export interface TimelinePoint {
  date: string; // ISO date
  portfolio: number;
  nifty50: number;
  gold: number;
}

// Interface for the performance API response
export interface PerformanceResponse {
  timeline: TimelinePoint[];
  returns: {
    portfolio: Record<"1month" | "3months" | "1year", number>;
    nifty50: Record<"1month" | "3months" | "1year", number>;
    gold: Record<"1month" | "3months" | "1year", number>;
  };
}

// Interface for the summary API response
export interface SummaryResponse {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  topPerformer: { symbol: string; name: string; gainPercent: number } | null;
  worstPerformer: { symbol: string; name: string; gainPercent: number } | null;
  diversificationScore: number;
  riskLevel: "Low" | "Moderate" | "High" | "Unknown";
  numberOfHoldings: number;
}