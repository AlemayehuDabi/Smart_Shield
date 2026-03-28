"use client";

import type { AllocationSlice, Metric } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

export function PortfolioView({ allocation, metrics }: { allocation: AllocationSlice[]; metrics: Metric[] }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ss-text-faint)]">Exposure &amp; performance</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ss-text)] md:text-2xl">Portfolio</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Allocation, leverage-aware exposure, and book-level PnL — tuned for fast scans before you size the next trade.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 ss-stagger">
        {metrics.map((m) => (
          <div key={m.id} className="ss-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--ss-text-faint)]">{m.label}</p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p
                className={cn(
                  "font-mono text-2xl font-medium tracking-tight",
                  m.trend === "up" && "text-[var(--ss-profit)]",
                  m.trend === "down" && "text-[var(--ss-loss)]",
                  m.trend === "flat" && "text-[var(--ss-text)]",
                )}
              >
                {m.value}
              </p>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 font-mono text-[10px]",
                  m.trend === "down" && "bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]",
                  m.trend === "up" && "bg-[var(--ss-profit-dim)] text-[var(--ss-profit)]",
                  m.trend === "flat" && "bg-[var(--ss-surface)] text-[var(--ss-text-faint)]",
                )}
              >
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="ss-card p-5 lg:col-span-2">
          <p className="text-xs font-medium text-[var(--ss-text)]">Allocation</p>
          <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">By sleeve · notional</p>
          <ul className="mt-5 space-y-4">
            {allocation.map((a, i) => (
              <li key={a.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--ss-text)]">{a.label}</span>
                  <span className="font-mono text-[var(--ss-text-muted)]">
                    {a.pct}% · {a.value}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--ss-bg)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--ss-accent)] to-[var(--ss-violet)] transition-all duration-700"
                    style={{ width: `${a.pct}%`, opacity: 0.35 + i * 0.12 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="ss-card p-5 lg:col-span-3">
          <p className="text-xs font-medium text-[var(--ss-text)]">Cross-greek stress (illustrative)</p>
          <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Scenario shocks vs current book — Lab runs full MC</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Δ −5% spot", v: "−$12.4k", t: "loss" },
              { k: "Vol +20%", v: "−$6.1k", t: "loss" },
              { k: "BTC −15%", v: "−$18.9k", t: "loss" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-[var(--ss-border)] bg-[var(--ss-surface)]/50 px-3 py-3">
                <p className="text-[10px] text-[var(--ss-text-faint)]">{s.k}</p>
                <p className={cn("mt-2 font-mono text-lg font-medium", s.t === "loss" ? "text-[var(--ss-loss)]" : "text-[var(--ss-profit)]")}>{s.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-[var(--ss-text-muted)]">
            Numbers are mock stress snapshots. In production, Smart Shield streams scenario PnL as you edit the book and flags when a proposed trade breaks your risk envelope.
          </p>
        </div>
      </div>
    </div>
  );
}
