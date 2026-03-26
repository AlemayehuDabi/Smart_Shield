"use client";

import type { AlertItem } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  items: AlertItem[];
  onMarkRead: (id: string) => void;
}

export function NotificationPanel({ open, onClose, items, onMarkRead }: NotificationPanelProps) {
  if (!open) return null;

  const sorted = [...items].sort((a, b) => a.priority - b.priority);

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[48] bg-black/40 backdrop-blur-sm"
        aria-label="Close notifications"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed right-4 top-[4.5rem] z-[49] w-[min(100vw-2rem,380px)] origin-top-right",
          "ss-animate-in rounded-2xl border border-[var(--ss-border-strong)] bg-[var(--ss-bg-elevated)] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]",
        )}
        role="dialog"
        aria-labelledby="notif-title"
      >
        <div className="flex items-center justify-between border-b border-[var(--ss-border)] px-4 py-3">
          <div>
            <h2 id="notif-title" className="text-sm font-medium text-[var(--ss-text)]">
              Alerts
            </h2>
            <p className="text-xs text-[var(--ss-text-muted)]">Prioritized by impact</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--ss-text-muted)] hover:bg-[var(--ss-surface)] hover:text-[var(--ss-text)]"
            aria-label="Close"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="max-h-[min(70vh,420px)] overflow-y-auto ss-scroll p-2">
          {sorted.map((a, i) => (
            <li
              key={a.id}
              className={cn(
                "ss-animate-in rounded-xl border border-transparent p-3 transition hover:border-[var(--ss-border)] hover:bg-[var(--ss-surface)]",
                !a.read && "bg-[var(--ss-violet-dim)]/40",
              )}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--ss-text)]">{a.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--ss-text-muted)]">{a.body}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--ss-text-faint)]">
                    {a.time}
                  </p>
                </div>
                {!a.read && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(a.id)}
                    className="shrink-0 rounded-lg border border-[var(--ss-border)] px-2 py-1 text-[10px] font-medium text-[var(--ss-text-muted)] transition hover:border-[var(--ss-accent)]/40 hover:text-[var(--ss-accent)]"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
