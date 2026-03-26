"use client";

import type { SystemState } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

interface TopStripProps {
  systemState: SystemState;
  onOpenAlerts: () => void;
  alertCount: number;
  assistantOpen: boolean;
  onToggleAssistant: () => void;
}

const stateCopy: Record<SystemState, { label: string; className: string }> = {
  safe: {
    label: "All systems nominal",
    className: "text-[var(--ss-safe)] bg-[rgba(52,211,153,0.12)] border-[rgba(52,211,153,0.25)]",
  },
  warning: {
    label: "Elevated watch — review suggested",
    className: "text-[var(--ss-warn)] bg-[rgba(251,191,36,0.1)] border-[rgba(251,191,36,0.28)]",
  },
  critical: {
    label: "Critical — immediate response",
    className: "text-[var(--ss-danger)] bg-[rgba(251,113,133,0.1)] border-[rgba(251,113,133,0.3)]",
  },
};

export function TopStrip({
  systemState,
  onOpenAlerts,
  alertCount,
  assistantOpen,
  onToggleAssistant,
}: TopStripProps) {
  const s = stateCopy[systemState];
  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--ss-border)] bg-[var(--ss-bg)]/80 px-5 py-3 backdrop-blur-xl">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--ss-text-faint)]">
            Smart Shield
          </p>
          <h1 className="truncate text-sm font-medium tracking-tight text-[var(--ss-text)]">
            Intelligent protection layer
          </h1>
        </div>
        <span
          className={cn(
            "hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium sm:inline-flex",
            s.className,
          )}
        >
          <span className="relative flex size-1.5">
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-40",
                systemState === "safe" && "bg-[var(--ss-safe)]",
                systemState === "warning" && "bg-[var(--ss-warn)]",
                systemState === "critical" && "bg-[var(--ss-danger)]",
              )}
            />
            <span
              className={cn(
                "relative inline-flex size-1.5 rounded-full",
                systemState === "safe" && "bg-[var(--ss-safe)]",
                systemState === "warning" && "bg-[var(--ss-warn)]",
                systemState === "critical" && "bg-[var(--ss-danger)]",
              )}
            />
          </span>
          {s.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] px-3 py-1.5 font-mono text-[11px] text-[var(--ss-text-muted)] md:flex">
          <span className="text-[var(--ss-text-faint)]">UTC</span>
          {now}
        </div>
        <button
          type="button"
          onClick={onOpenAlerts}
          className="relative flex size-10 items-center justify-center rounded-xl border border-[var(--ss-border)] bg-[var(--ss-surface)] text-[var(--ss-text-muted)] transition hover:border-[var(--ss-border-strong)] hover:text-[var(--ss-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40"
          aria-label="Open notifications"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {alertCount > 0 && (
            <span className="ss-alert-dot absolute right-2 top-2 size-2 rounded-full bg-[var(--ss-danger)]" />
          )}
        </button>
        <button
          type="button"
          onClick={onToggleAssistant}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ss-accent)]/40",
            assistantOpen
              ? "border-[rgba(94,234,212,0.35)] bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]"
              : "border-[var(--ss-border)] bg-[var(--ss-surface)] text-[var(--ss-text-muted)] hover:border-[var(--ss-border-strong)] hover:text-[var(--ss-text)]",
          )}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.666 16.108 3 13.73 3 11.25 3 6.701 7.03 3 12 3s9 3.701 9 8.25z" />
          </svg>
          <span className="hidden sm:inline">{assistantOpen ? "Hide copilot" : "Copilot"}</span>
        </button>
      </div>
    </header>
  );
}
