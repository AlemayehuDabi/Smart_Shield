"use client";

import { useState } from "react";
import type { Severity, TradingSignal } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

const severityStyles: Record<Severity, { label: string; bar: string; text: string }> = {
  low: { label: "Low", bar: "bg-[var(--ss-text-faint)]", text: "text-[var(--ss-text-muted)]" },
  medium: { label: "Medium", bar: "bg-[var(--ss-warn)]", text: "text-[var(--ss-warn)]" },
  high: { label: "High", bar: "bg-[var(--ss-danger)]", text: "text-[var(--ss-danger)]" },
  critical: {
    label: "Critical",
    bar: "bg-[var(--ss-danger)] shadow-[0_0_12px_rgba(251,113,133,0.5)]",
    text: "text-[var(--ss-danger)]",
  },
};

export function SignalsView({ signals }: { signals: TradingSignal[] }) {
  const [expanded, setExpanded] = useState<string | null>(signals[0]?.id ?? null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium tracking-tight text-[var(--ss-text)]">Risk &amp; signals</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Pre- and post-trade intelligence ranked by portfolio impact. Each row is model-traceable to your own history — not generic market spam.
        </p>
      </div>

      <div className="space-y-2">
        {signals.map((t) => {
          const sev = severityStyles[t.severity];
          const isOpen = expanded === t.id;
          return (
            <div
              key={t.id}
              className={cn(
                "ss-card overflow-hidden transition-[box-shadow] duration-300",
                isOpen && "ring-1 ring-[var(--ss-accent)]/25",
              )}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : t.id)}
                className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-[var(--ss-surface-hover)]/50"
              >
                <div className={cn("mt-0.5 h-10 w-1 shrink-0 rounded-full", sev.bar)} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-[11px] font-semibold uppercase tracking-wider", sev.text)}>{sev.label}</span>
                    <span className="text-[11px] text-[var(--ss-text-faint)]">·</span>
                    <span className="font-mono text-[11px] text-[var(--ss-text-faint)]">{t.detectedAt}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[var(--ss-text)]">{t.title}</p>
                  <p className="mt-1 text-xs text-[var(--ss-text-muted)]">{t.summary}</p>
                  <p className="mt-2 font-mono text-[10px] text-[var(--ss-text-faint)]">{t.source}</p>
                </div>
                <svg
                  className={cn("size-5 shrink-0 text-[var(--ss-text-faint)] transition-transform", isOpen && "rotate-180")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isOpen && (
                <div className="space-y-4 border-t border-[var(--ss-border)] bg-[var(--ss-bg-elevated)]/80 px-4 py-4 ss-animate-in">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ss-accent)]">Explainability</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ss-text-muted)]">{t.aiExplanation}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ss-violet)]">Playbook</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-[var(--ss-text)]">
                      {t.suggestedActions.map((a) => (
                        <li key={a} className="flex gap-2">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[var(--ss-accent)]" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] px-3 py-2 text-xs font-medium text-[var(--ss-text)] transition hover:border-[var(--ss-accent)]/35 hover:text-[var(--ss-accent)]"
                    >
                      Route to Lab
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-[var(--ss-border)] px-3 py-2 text-xs font-medium text-[var(--ss-text-muted)] transition hover:border-[var(--ss-border-strong)] hover:text-[var(--ss-text)]"
                    >
                      Snooze 4h
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-transparent px-3 py-2 text-xs font-medium text-[var(--ss-text-faint)] transition hover:text-[var(--ss-text-muted)]"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
