"use client";

import type { JournalEntry } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

export function JournalView({ entries }: { entries: JournalEntry[] }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ss-text-faint)]">Trade → feedback → learn</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ss-text)] md:text-2xl">Journal</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Automatic capture with AI annotations. Every entry links to behavior tags the coach uses for the next nudge.
        </p>
      </div>

      <div className="grid gap-3">
        {entries.map((e) => (
          <article key={e.id} className="ss-card group overflow-hidden p-4 transition hover:border-[var(--ss-border-strong)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] text-[var(--ss-text-faint)]">{e.date}</span>
                  <span className="font-mono text-sm font-semibold text-[var(--ss-text)]">{e.symbol}</span>
                  <span className="text-xs text-[var(--ss-text-muted)]">{e.side}</span>
                </div>
                <p
                  className={cn(
                    "mt-2 font-mono text-lg font-medium",
                    e.result === "win" && "text-[var(--ss-profit)]",
                    e.result === "loss" && "text-[var(--ss-loss)]",
                    e.result === "scratch" && "text-[var(--ss-text-muted)]",
                  )}
                >
                  {e.pnl}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                  e.result === "win" && "border-[var(--ss-profit)]/40 bg-[var(--ss-profit-dim)] text-[var(--ss-profit)]",
                  e.result === "loss" && "border-[var(--ss-loss)]/40 bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]",
                  e.result === "scratch" && "border-[var(--ss-border)] text-[var(--ss-text-faint)]",
                )}
              >
                {e.result}
              </span>
            </div>
            <div className="mt-4 border-t border-[var(--ss-border)] pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ss-violet)]">AI note</p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--ss-text-muted)]">{e.aiNote}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
