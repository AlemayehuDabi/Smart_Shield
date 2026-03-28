"use client";

import { useState } from "react";
import { CandleChart } from "@/components/trading/CandleChart";
import {
  activeSymbol,
  chartCandles,
  chartOverlayNote,
  positions,
  preTradeWarning,
  recentOrders,
  watchlist,
  type WatchRow,
} from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

function WatchlistPanel({ rows, selected, onSelect }: { rows: WatchRow[]; selected: string; onSelect: (s: string) => void }) {
  return (
    <div className="ss-card flex max-h-[420px] flex-col overflow-hidden">
      <div className="border-b border-[var(--ss-border)] px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ss-text-faint)]">Watchlist</p>
        <p className="text-[11px] text-[var(--ss-text-muted)]">Multi-asset · live mock</p>
      </div>
      <div className="ss-scroll flex-1 overflow-y-auto p-1">
        {rows.map((r) => {
          const sel = selected === r.symbol;
          return (
            <button
              key={r.symbol}
              type="button"
              onClick={() => onSelect(r.symbol)}
              className={cn(
                "flex w-full flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                sel ? "bg-[var(--ss-accent-dim)] ring-1 ring-[var(--ss-accent)]/25" : "hover:bg-[var(--ss-surface)]",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-medium text-[var(--ss-text)]">{r.symbol}</span>
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    r.chgPct >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]",
                  )}
                >
                  {r.chgPct >= 0 ? "+" : ""}
                  {r.chgPct.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--ss-text-faint)]">
                <span>{r.asset}</span>
                <span className="font-mono text-[var(--ss-text-muted)]">{r.last}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrderTicket() {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [otype, setOtype] = useState<"Market" | "Limit" | "Stop">("Limit");
  return (
    <div className="ss-card ss-card-focus flex flex-col overflow-hidden">
      <div className="border-b border-[var(--ss-border)] px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ss-text-faint)]">Execute</p>
        <p className="text-[11px] text-[var(--ss-text-muted)]">{otype} · paper-safe UI</p>
      </div>
      <div className="flex gap-1 p-2">
        <button
          type="button"
          onClick={() => setSide("buy")}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-semibold transition",
            side === "buy" ? "bg-[var(--ss-profit-dim)] text-[var(--ss-profit)]" : "text-[var(--ss-text-muted)] hover:bg-[var(--ss-surface)]",
          )}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setSide("sell")}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-semibold transition",
            side === "sell" ? "bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]" : "text-[var(--ss-text-muted)] hover:bg-[var(--ss-surface)]",
          )}
        >
          Sell
        </button>
      </div>
      <div className="flex gap-1 border-b border-[var(--ss-border)] px-2 pb-2">
        {(["Market", "Limit", "Stop"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setOtype(t)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-[10px] font-medium transition",
              otype === t ? "bg-[var(--ss-surface-hover)] text-[var(--ss-text)]" : "text-[var(--ss-text-faint)] hover:text-[var(--ss-text-muted)]",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3 p-3">
        <label className="block">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--ss-text-faint)]">Size</span>
          <input
            type="text"
            defaultValue="0.10"
            className="mt-1 w-full rounded-lg border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] px-3 py-2 font-mono text-sm text-[var(--ss-text)] focus:border-[var(--ss-accent)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--ss-accent)]/15"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--ss-text-faint)]">Price</span>
          <input
            type="text"
            defaultValue={otype === "Market" ? "MKT" : "67,800"}
            disabled={otype === "Market"}
            className="mt-1 w-full rounded-lg border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)] px-3 py-2 font-mono text-sm text-[var(--ss-text)] focus:border-[var(--ss-accent)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--ss-accent)]/15 disabled:opacity-50"
          />
        </label>
        <div className="rounded-lg border border-[var(--ss-violet-dim)] bg-[var(--ss-violet-dim)]/40 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--ss-violet)]">AI pre-check</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[var(--ss-text-muted)]">{preTradeWarning}</p>
        </div>
        <button
          type="button"
          className={cn(
            "w-full rounded-xl py-3 text-sm font-semibold transition",
            side === "buy"
              ? "bg-[var(--ss-profit)] text-[var(--ss-bg-deep)] hover:opacity-95"
              : "bg-[var(--ss-loss)] text-white hover:opacity-95",
          )}
        >
          Review &amp; route {side === "buy" ? "long" : "short"}
        </button>
      </div>
    </div>
  );
}

function PositionsBlock() {
  return (
    <div className="ss-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--ss-border)] px-4 py-3">
        <div>
          <p className="text-xs font-medium text-[var(--ss-text)]">Open positions</p>
          <p className="text-[11px] text-[var(--ss-text-muted)]">Live PnL · net of fees (mock)</p>
        </div>
        <span className="rounded-full border border-[var(--ss-border)] px-2 py-0.5 font-mono text-[10px] text-[var(--ss-text-faint)]">3 legs</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--ss-border)] text-[10px] uppercase tracking-wider text-[var(--ss-text-faint)]">
              <th className="px-4 py-2 font-medium">Symbol</th>
              <th className="px-4 py-2 font-medium">Side</th>
              <th className="px-4 py-2 font-medium ss-tabular">Size</th>
              <th className="px-4 py-2 font-medium ss-tabular">Entry</th>
              <th className="px-4 py-2 font-medium ss-tabular">Mark</th>
              <th className="px-4 py-2 font-medium ss-tabular">PnL</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr key={p.id} className="border-b border-[var(--ss-border)]/60 transition-colors hover:bg-[var(--ss-surface)]/50">
                <td className="px-4 py-2.5 font-mono font-medium text-[var(--ss-text)]">{p.symbol}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase",
                      p.side === "long" ? "bg-[var(--ss-profit-dim)] text-[var(--ss-profit)]" : "bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]",
                    )}
                  >
                    {p.side}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-[var(--ss-text-muted)]">{p.size}</td>
                <td className="px-4 py-2.5 font-mono text-[var(--ss-text-muted)]">{p.entry}</td>
                <td className="px-4 py-2.5 font-mono text-[var(--ss-text)]">{p.mark}</td>
                <td className="px-4 py-2.5">
                  <span className={cn("font-mono font-medium", p.pnlPct >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]")}>
                    {p.pnl} <span className="text-[10px] opacity-80">({p.pnlPct >= 0 ? "+" : ""}{p.pnlPct.toFixed(2)}%)</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderLog() {
  return (
    <div className="ss-card overflow-hidden">
      <div className="border-b border-[var(--ss-border)] px-4 py-3">
        <p className="text-xs font-medium text-[var(--ss-text)]">Recent orders</p>
      </div>
      <ul className="divide-y divide-[var(--ss-border)]">
        {recentOrders.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-xs transition hover:bg-[var(--ss-surface)]/40">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[var(--ss-text-faint)]">{o.time}</span>
              <span className="font-mono font-medium text-[var(--ss-text)]">{o.symbol}</span>
              <span className={cn("font-semibold", o.side === "buy" ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]")}>{o.side}</span>
              <span className="text-[var(--ss-text-muted)]">{o.type}</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[var(--ss-text-muted)]">
              <span>{o.qty}</span>
              <span>{o.price}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",
                  o.status === "filled" && "bg-[var(--ss-profit-dim)] text-[var(--ss-profit)]",
                  o.status === "working" && "bg-[var(--ss-warn)]/15 text-[var(--ss-warn)]",
                  o.status === "cancelled" && "text-[var(--ss-text-faint)]",
                )}
              >
                {o.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TerminalView() {
  const [sym, setSym] = useState(activeSymbol);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ss-text-faint)]">Trade → feedback → learn</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--ss-text)] md:text-2xl">Terminal</h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--ss-text-muted)]">
            One surface for tape, risk, and execution. Inline AI reads your behavior — not just the market.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[var(--ss-border)] bg-[var(--ss-surface)] px-3 py-1 font-mono text-[11px] text-[var(--ss-text-muted)]">
            Active: <span className="text-[var(--ss-text)]">{sym}</span>
          </span>
          <span className="rounded-full border border-[var(--ss-accent)]/30 bg-[var(--ss-accent-dim)] px-3 py-1 text-[11px] font-medium text-[var(--ss-accent)]">
            AI overlay on
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[var(--ss-violet)]/25 bg-[var(--ss-violet-dim)]/25 px-4 py-3">
        <div className="absolute right-0 top-0 size-24 rounded-full bg-[var(--ss-violet)]/10 blur-2xl" />
        <p className="relative text-[11px] font-semibold uppercase tracking-wider text-[var(--ss-violet)]">Live nudge</p>
        <p className="relative mt-1 max-w-3xl text-sm leading-relaxed text-[var(--ss-text-muted)]">
          <span className="text-[var(--ss-text)]">{chartOverlayNote.label}:</span> {chartOverlayNote.text}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,200px)_minmax(0,1fr)_minmax(0,280px)]">
        <div className="hidden xl:block">
          <WatchlistPanel rows={watchlist} selected={sym} onSelect={setSym} />
        </div>

        <div className="space-y-4">
          <div className="xl:hidden">
            <WatchlistPanel rows={watchlist} selected={sym} onSelect={setSym} />
          </div>
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--ss-border)] bg-[var(--ss-chart-bg)]">
            <CandleChart candles={chartCandles} highlightBar={chartOverlayNote.barIndex} title={sym} />
          </div>
          <PositionsBlock />
        </div>

        <div className="space-y-4">
          <OrderTicket />
        </div>
      </div>

      <OrderLog />
    </div>
  );
}
