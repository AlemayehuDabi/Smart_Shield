"use client";

import { ConfidenceArc } from "@/components/charts/ConfidenceArc";
import { Sparkline } from "@/components/charts/Sparkline";
import { Badge } from "@/components/app/primitives";
import { cn } from "@/components/ui/cn";
import { statusLabel, type Signal } from "@/lib/data/signals";
import { TrendDown, TrendUp } from "@/components/ui/icons";

export function SignalCard({
  signal,
  active,
  onSelect,
}: {
  signal: Signal;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const isLong = signal.direction === "long";
  const closed = signal.status.startsWith("closed");
  const spark = signal.candles.slice(-24).map((c) => c.c);

  return (
    <button
      type="button"
      onClick={() => onSelect(signal.id)}
      aria-pressed={active}
      className={cn(
        "ss-card w-full p-4 text-left transition-all",
        active && "!border-[var(--ss-accent)]/50 !bg-[var(--ss-surface-hover)] ring-1 ring-[var(--ss-accent)]/20"
      )}
    >
      <div className="flex items-center gap-3">
        <ConfidenceArc value={signal.confidence} size={42} strokeWidth={3.5} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-[14px] font-semibold tracking-tight">
              {signal.symbol}
            </span>
            <Badge
              tone={isLong ? "profit" : "loss"}
              icon={isLong ? <TrendUp size={10} /> : <TrendDown size={10} />}
            >
              {signal.direction}
            </Badge>
            <span className="ml-auto font-mono text-[10px] text-[var(--ss-text-faint)]">
              {signal.timeframe} · {signal.generatedAt}
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-[var(--ss-text-muted)]">
            {signal.thesis}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {closed ? (
            <span
              className={cn(
                "ss-tabular text-[12px] font-semibold",
                (signal.resultPct ?? 0) >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]"
              )}
            >
              {(signal.resultPct ?? 0) >= 0 ? "+" : ""}
              {signal.resultPct?.toFixed(1)}% · {statusLabel(signal.status)}
            </span>
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-mono text-[10.5px]",
                signal.status === "active"
                  ? "text-[var(--ss-accent)]"
                  : "text-[var(--ss-text-faint)]"
              )}
            >
              {signal.status === "active" && (
                <span className="ss-live-dot h-1.5 w-1.5 rounded-full bg-[var(--ss-accent)]" />
              )}
              {statusLabel(signal.status)}
            </span>
          )}
        </div>
        <Sparkline
          points={spark}
          width={80}
          height={22}
          color={isLong ? "var(--ss-profit)" : "var(--ss-loss)"}
          className="h-5 w-20"
        />
      </div>
    </button>
  );
}
