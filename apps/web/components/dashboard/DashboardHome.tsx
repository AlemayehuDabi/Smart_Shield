"use client";

import { SparkArea } from "@/components/charts/SparkArea";
import { MiniBars } from "@/components/charts/MiniBars";
import type { Metric, SystemState, TimelineEvent } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

interface DashboardHomeProps {
  systemState: SystemState;
  metrics: Metric[];
  insightSummary: string;
  timeline: TimelineEvent[];
  riskSeries: number[];
  activitySeries: number[];
  chartLabels: string[];
}

function StateOrb({ state }: { state: SystemState }) {
  return (
    <div className="relative flex size-28 items-center justify-center">
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-2xl",
          state === "safe" && "bg-[rgba(52,211,153,0.2)]",
          state === "warning" && "bg-[rgba(251,191,36,0.18)]",
          state === "critical" && "bg-[rgba(251,113,133,0.22)]",
        )}
      />
      <div
        className={cn(
          "relative flex size-24 items-center justify-center rounded-full border border-[var(--ss-border-strong)] bg-[var(--ss-bg-elevated)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        )}
      >
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ss-text-faint)]">Status</p>
          <p
            className={cn(
              "mt-1 text-lg font-semibold tracking-tight",
              state === "safe" && "text-[var(--ss-safe)]",
              state === "warning" && "text-[var(--ss-warn)]",
              state === "critical" && "text-[var(--ss-danger)]",
            )}
          >
            {state === "safe" && "Safe"}
            {state === "warning" && "Watch"}
            {state === "critical" && "Critical"}
          </p>
        </div>
      </div>
    </div>
  );
}

const toneBorder: Record<TimelineEvent["tone"], string> = {
  neutral: "border-[var(--ss-text-faint)]",
  info: "border-[var(--ss-accent)]",
  warn: "border-[var(--ss-warn)]",
  danger: "border-[var(--ss-danger)]",
};

export function DashboardHome({
  systemState,
  metrics,
  insightSummary,
  timeline,
  riskSeries,
  activitySeries,
  chartLabels,
}: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[var(--ss-border)] bg-gradient-to-br from-[var(--ss-surface)] to-transparent p-6 md:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[var(--ss-accent)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-[var(--ss-violet)]/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--ss-text-faint)]">
              Intelligent dashboard
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--ss-text)] md:text-3xl">
              Clarity under pressure.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--ss-text-muted)]">
              Real-time synthesis across signals, identity, and automation — tuned for operators who need the story,
              not the noise.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[var(--ss-border)] bg-[var(--ss-bg)]/60 px-3 py-1 text-xs text-[var(--ss-text-muted)]">
                Live ingest
              </span>
              <span className="rounded-full border border-[var(--ss-border)] bg-[var(--ss-bg)]/60 px-3 py-1 text-xs text-[var(--ss-text-muted)]">
                Model v4.2 canary
              </span>
              <span className="rounded-full border border-[var(--ss-border)] bg-[var(--ss-bg)]/60 px-3 py-1 text-xs text-[var(--ss-text-muted)]">
                Zero-trust adjacency
              </span>
            </div>
          </div>
          <StateOrb state={systemState} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 ss-stagger">
        {metrics.map((m) => (
          <div key={m.id} className="ss-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--ss-text-faint)]">{m.label}</p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="font-mono text-2xl font-medium tracking-tight text-[var(--ss-text)]">{m.value}</p>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 font-mono text-[10px]",
                  m.trend === "down" && "bg-[rgba(52,211,153,0.1)] text-[var(--ss-safe)]",
                  m.trend === "up" && "bg-[rgba(167,139,250,0.12)] text-[var(--ss-violet)]",
                  m.trend === "flat" && "bg-[var(--ss-surface)] text-[var(--ss-text-faint)]",
                )}
              >
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="ss-card ss-card-focus lg:col-span-3">
          <div className="border-b border-[var(--ss-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--ss-text)]">AI-generated summary</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Updated moments ago · grounded in your telemetry</p>
          </div>
          <p className="px-5 py-5 text-sm leading-relaxed text-[var(--ss-text-muted)]">{insightSummary}</p>
        </div>

        <div className="ss-card lg:col-span-2">
          <div className="border-b border-[var(--ss-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--ss-text)]">Risk trajectory</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">7-day composite</p>
          </div>
          <div className="p-4">
            <SparkArea values={riskSeries} className="h-24 w-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="ss-card">
          <div className="border-b border-[var(--ss-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--ss-text)]">Activity timeline</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Operational narrative</p>
          </div>
          <ul className="divide-y divide-[var(--ss-border)] px-2 py-2">
            {timeline.map((e) => (
              <li key={e.id} className="flex gap-3 px-3 py-3">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full border-2 bg-transparent",
                    toneBorder[e.tone],
                  )}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-[11px] text-[var(--ss-text-faint)]">{e.time}</span>
                    <span className="text-sm font-medium text-[var(--ss-text)]">{e.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--ss-text-muted)]">{e.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="ss-card">
          <div className="border-b border-[var(--ss-border)] px-5 py-4">
            <p className="text-xs font-medium text-[var(--ss-text)]">Usage pulse</p>
            <p className="mt-1 text-[11px] text-[var(--ss-text-muted)]">Normalized weekly rhythm</p>
          </div>
          <div className="p-4">
            <MiniBars values={activitySeries} labels={chartLabels} />
          </div>
        </div>
      </div>
    </div>
  );
}
