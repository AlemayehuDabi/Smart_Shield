"use client";

import { SparkArea } from "@/components/charts/SparkArea";
import { MiniBars } from "@/components/charts/MiniBars";

interface AnalyticsViewProps {
  riskSeries: number[];
  activitySeries: number[];
  labels: string[];
  patternHighlights: { label: string; value: string; detail: string }[];
}

export function AnalyticsView({
  riskSeries,
  activitySeries,
  labels,
  patternHighlights,
}: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight text-[var(--ss-text)]">Behavior analytics</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Trend surfaces with pattern callouts — built for spotting drift before it becomes an incident.
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
            <p className="text-xs font-medium text-[var(--ss-text)]">Risk trend</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Smoothed composite · 7d</p>
          </div>
          <div className="p-5">
            <SparkArea values={riskSeries} height={120} className="h-32 w-full" />
          </div>
        </div>
        <div className="ss-card">
          <div className="border-b border-[var(--ss-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--ss-text)]">Activity shape</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Relative volume by day</p>
          </div>
          <div className="p-5">
            <MiniBars values={activitySeries} labels={labels} />
          </div>
        </div>
      </div>

      <div className="ss-card overflow-hidden">
        <div className="border-b border-[var(--ss-border)] px-5 py-4">
          <p className="text-xs font-medium text-[var(--ss-text)]">Pattern detection</p>
          <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">
            Heuristic clusters (illustrative) — hover states demonstrate micro-interaction polish
          </p>
        </div>
        <div className="grid gap-px bg-[var(--ss-border)] md:grid-cols-3">
          {["Automation spike", "Geo hop", "Credential adjacency"].map((name, i) => (
            <div key={name} className="bg-[var(--ss-bg)] p-5 transition hover:bg-[var(--ss-surface)]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-[var(--ss-text)]">{name}</p>
                <span className="rounded-full bg-[var(--ss-violet-dim)] px-2 py-0.5 font-mono text-[10px] text-[var(--ss-violet)]">
                  {85 + i * 3}%
                </span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--ss-surface)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--ss-violet)] to-[var(--ss-accent)] transition-all duration-500"
                  style={{ width: `${72 + i * 8}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-[var(--ss-text-muted)]">
                Confidence reflects cross-signal agreement — not standalone precision.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
