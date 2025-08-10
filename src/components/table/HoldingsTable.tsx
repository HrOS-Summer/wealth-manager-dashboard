"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { formatCurrency, pct, gainColor } from "@/lib/format";
import type { HoldingComputed } from "@/lib/types";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

const ch = createColumnHelper<HoldingComputed>();

export default function HoldingsTable({ data }: { data: HoldingComputed[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "value", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      ch.accessor("symbol", {
        header: "Symbol",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      ch.accessor("name", { header: "Company" }),
      ch.accessor("sector", { header: "Sector" }),
      ch.accessor("marketCap", { header: "Cap" }),
      ch.accessor("quantity", { header: "Qty" }),
      ch.accessor("avgPrice", {
        header: "Avg Price",
        cell: (i) => formatCurrency(i.getValue()),
      }),
      ch.accessor("currentPrice", {
        header: "Current",
        cell: (i) => formatCurrency(i.getValue()),
      }),
      ch.accessor("value", {
        header: "Value",
        cell: (i) => formatCurrency(i.getValue()),
      }),
      ch.accessor("gainLoss", {
        header: "P/L",
        cell: (i) => (
          <span className={gainColor(i.getValue())}>
            {formatCurrency(i.getValue())}
          </span>
        ),
      }),
      ch.accessor("gainLossPercent", {
        header: "P/L %",
        cell: (i) => (
          <span className={gainColor(i.getValue())}>
            {pct(i.getValue())}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const v = String(row.getValue(columnId)).toLowerCase();
      return v.includes(String(filterValue).toLowerCase());
    },
  });

  return (
    <div className="overflow-auto">
      <div className="mb-3">
        <input
          className="w-full md:w-80 rounded border dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm"
          placeholder="Search by symbol, company, sector..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-3 py-2 text-left font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ArrowUp size={14} />,
                      desc: <ArrowDown size={14} />,
                    }[header.column.getIsSorted() as "asc" | "desc"] ?? <ArrowUpDown size={14} className="text-neutral-400" />}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {(!data || data.length === 0) && (
        <div className="text-center text-neutral-500 py-6">No holdings available</div>
      )}
    </div>
  );
}