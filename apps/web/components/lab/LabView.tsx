"use client";

import type { LabModule } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

export function LabView({ modules }: { modules: LabModule[] }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ss-text-faint)]">Simulation &amp; research</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ss-text)] md:text-2xl">Lab</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Paper, backtests, and strategy forks — same UX chrome as live, so improvements transfer without context loss.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {modules.map((m) => (
          <div
            key={m.id}
            className="ss-card flex flex-col p-5 transition hover:ring-1 hover:ring-[var(--ss-accent)]/20"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-[var(--ss-text)]">{m.name}</p>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase",
                  m.status === "running" && "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]",
                  m.status === "ready" && "bg-[var(--ss-surface)] text-[var(--ss-text-muted)]",
                  m.status === "idle" && "bg-[var(--ss-bg)] text-[var(--ss-text-faint)]",
                )}
              >
                {m.status}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--ss-text-muted)]">{m.description}</p>
            {m.lastRun && (
              <p className="mt-4 font-mono text-[10px] text-[var(--ss-text-faint)]">Last: {m.lastRun}</p>
            )}
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-[var(--ss-border)] py-2.5 text-xs font-medium text-[var(--ss-text)] transition hover:border-[var(--ss-accent)]/40 hover:text-[var(--ss-accent)]"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
