import { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-800/80 backdrop-blur border-b dark:border-neutral-700">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">WealthManager Dashboard</h1>
          <div className="text-sm text-neutral-500">Next.js - Interactive - Responsive</div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}