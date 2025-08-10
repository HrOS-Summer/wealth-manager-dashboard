"use client";

import React from "react";
import { formatCurrency, pct, gainColor } from "@/lib/format";
import type { SummaryResponse } from "@/lib/types";
import clsx from "clsx";

/**
 * Renders a grid of cards showing the top and worst performing holdings,
 * as well as key portfolio insights.
 */
export default function TopPerformers({ summary }: { summary: SummaryResponse }) {
  if (!summary) {
    return null;
  }

  const { topPerformer, worstPerformer, diversificationScore, riskLevel } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Best Performer Card */}
      <div className="rounded-lg border dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm">
        <div className="text-sm text-neutral-500 mb-1">Best Performer</div>
        {topPerformer ? (
          <>
            <div className="font-semibold">{topPerformer.name} ({topPerformer.symbol})</div>
            <div className={clsx("text-lg", gainColor(topPerformer.gainPercent))}>
              {pct(topPerformer.gainPercent)}
            </div>
          </>
        ) : (
          <div className="text-neutral-500">N/A</div>
        )}
      </div>

      {/* Worst Performer Card */}
      <div className="rounded-lg border dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm">
        <div className="text-sm text-neutral-500 mb-1">Worst Performer</div>
        {worstPerformer ? (
          <>
            <div className="font-semibold">{worstPerformer.name} ({worstPerformer.symbol})</div>
            <div className={clsx("text-lg", gainColor(worstPerformer.gainPercent))}>
              {pct(worstPerformer.gainPercent)}
            </div>
          </>
        ) : (
          <div className="text-neutral-500">N/A</div>
        )}
      </div>

      {/* Insights Card */}
      <div className="rounded-lg border dark:border-neutral-700 p-4 bg-white dark:bg-neutral-800 shadow-sm">
        <div className="text-sm text-neutral-500 mb-1">Insights</div>
        <div className="flex items-center justify-between py-1">
          <div className="text-neutral-700 dark:text-neutral-300">Diversification Score</div>
          <div className="font-semibold">{(diversificationScore ?? 0).toFixed(1)}/10</div>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="text-neutral-700 dark:text-neutral-300">Risk Level</div>
          <div className="font-semibold">{riskLevel}</div>
        </div>
      </div>
    </div>
  );
}