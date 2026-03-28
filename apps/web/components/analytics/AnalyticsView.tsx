"use client";

import { SparkArea } from "@/components/charts/SparkArea";
import { MiniBars } from "@/components/charts/MiniBars";
import type { MistakePattern } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

interface AnalyticsViewProps {
  pnlSeries: number[];
  tradeCountSeries: number[];
  labels: string[];
  patternHighlights: { label: string; value: string; detail: string }[];
  mistakes: MistakePattern[];
}

export function AnalyticsView({
  pnlSeries,
  tradeCountSeries,
  labels,
  patternHighlights,
  mistakes,
}: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ss-text-faint)]">Performance intelligence</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ss-text)] md:text-2xl">Analytics</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          PnL attribution, behavioral load, and mistake economics — the same view the coach uses to prioritize the next intervention.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {patternHighlights.map((p) => (
          <div key={p.label} className="ss-card group p-5 transition hover:ring-1 hover:ring-[var(--ss-accent)]/20">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--ss-text-faint)]">{p.label}</p>
            <p className="mt-3 font-mono text-3xl font-medium tracking-tight text-[var(--ss-text)]">{p.value}</p>
            <p className="mt-2 text-xs text-[var(--ss-text-muted)]">{p.detail}</p>
            <div className="mt-4 h-px w-full bg-gradient-to-r from-[var(--ss-accent)]/40 to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ss-card">
          <div className="border-b border-[var(--ss-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--ss-text)]">Cumulative PnL (7d)</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Normalized to session equity curve</p>
          </div>
          <div className="p-4">
            <SparkArea values={pnlSeries} stroke="rgba(74, 222, 128, 0.9)" height={120} className="h-32 w-full" />
          </div>
        </div>
        <div className="ss-card">
          <div className="border-b border-[var(--ss-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--ss-text)]">Trade cadence</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Count per day — overtrading shows here first</p>
          </div>
          <div className="p-4">
            <MiniBars values={tradeCountSeries} labels={labels} />
          </div>
        </div>
      </div>

      <div className="ss-card overflow-hidden">
        <div className="border-b border-[var(--ss-border)] px-5 py-4">
          <p className="text-xs font-medium text-[var(--ss-text)]">Mistake ledger</p>
          <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Estimated bleed when pattern repeats — drives coach priority</p>
        </div>
        <div className="divide-y divide-[var(--ss-border)]">
          {mistakes.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-[var(--ss-surface)]/40">
              <div>
                <p className="text-sm font-medium text-[var(--ss-text)]">{m.label}</p>
                <p className="mt-1 font-mono text-[11px] text-[var(--ss-text-faint)]">{m.count} occurrences · rolling 60d</p>
              </div>
              <span className="font-mono text-sm font-semibold text-[var(--ss-loss)]">{m.impact}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ss-border)] bg-[var(--ss-border)] md:grid-cols-3">
        {[
          { t: "Emotional velocity", d: "Order-to-order time collapses after red streaks.", k: "High" },
          { t: "Rule adherence", d: "Stops moved wider than plan on 38% of losers.", k: "Watch" },
          { t: "Regime fit", d: "Mean-reversion legs negative EV in current vol bucket.", k: "Info" },
        ].map((x) => (
          <div key={x.t} className="bg-[var(--ss-bg)] p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-[var(--ss-text)]">{x.t}</p>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[10px]",
                  x.k === "High" && "bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]",
                  x.k === "Watch" && "bg-[var(--ss-warn)]/15 text-[var(--ss-warn)]",
                  x.k === "Info" && "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]",
                )}
              >
                {x.k}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ss-text-muted)]">{x.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
