"use client";

import { AreaLine } from "@/components/charts/AreaLine";
import { Bars } from "@/components/charts/Bars";
import { Badge, StatTile } from "@/components/app/primitives";
import {
  backtestBenchmark,
  backtestEquity,
  backtestMetrics as m,
  backtestMonths,
} from "@/lib/data/automation";
import { Bot, Check, Lock, Play, Sparkles } from "@/components/ui/icons";

export function BacktestView({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-[17px] font-semibold tracking-tight">Mean-reversion · BTC</h2>
            <Badge tone="profit">Passed</Badge>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[var(--ss-text-faint)]">
            BTC/USDT · 4H · 120 bars · vs. buy-and-hold
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={onEdit} className="ss-btn ss-btn-ghost px-4 py-2 text-[13px]">
            Edit rules
          </button>
          <button type="button" className="ss-btn ss-btn-primary px-4 py-2 text-[13px]">
            <Play size={14} /> Run again
          </button>
        </div>
      </div>

      {/* headline metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Net return" value={`+${m.netReturn}%`} tone="profit" sub={`hold +${m.benchmark}%`} />
        <StatTile label="Win rate" value={`${m.winRate}%`} sub={`${m.trades} trades`} />
        <StatTile label="Profit factor" value={m.profitFactor.toFixed(1)} />
        <StatTile label="Max drawdown" value={`${m.maxDrawdown}%`} tone="loss" />
      </div>

      {/* equity curve */}
      <section className="ss-card overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ss-border)] px-5 py-3.5">
          <p className="ss-eyebrow !text-[9.5px]">Backtest equity curve</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-[var(--ss-text)]">
              <span className="h-[3px] w-4 rounded-full bg-[var(--ss-chart-1)]" /> Strategy
            </span>
            <span className="flex items-center gap-1.5 text-[var(--ss-text-muted)]">
              <span className="h-[3px] w-4 rounded-full bg-[var(--ss-chart-neutral)]" /> Buy &amp; hold
            </span>
          </div>
        </header>
        <div className="px-3 pb-3 pt-4">
          <AreaLine
            uid="bt-equity"
            series={[
              { points: backtestEquity, color: "var(--ss-chart-1)", fill: true, label: "Strategy" },
              { points: backtestBenchmark, color: "var(--ss-chart-neutral)", dashed: true, label: "Buy & hold" },
            ]}
            height={240}
            width={860}
            animate
            className="h-[240px] w-full"
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* detailed stats */}
        <section className="ss-card p-5 lg:col-span-2">
          <p className="ss-eyebrow !text-[9.5px] mb-4">Full breakdown</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {[
              ["Sharpe ratio", m.sharpe.toFixed(2), null],
              ["Expectancy", `+$${m.expectancy}`, "profit"],
              ["Avg hold", m.avgHold, null],
              ["Best trade", `+$${m.bestTrade}`, "profit"],
              ["Worst trade", `−$${Math.abs(m.worstTrade)}`, "loss"],
              ["Total trades", m.trades.toString(), null],
            ].map(([k, v, tone]) => (
              <div key={k as string}>
                <dt className="font-mono text-[9.5px] uppercase tracking-widest text-[var(--ss-text-faint)]">
                  {k}
                </dt>
                <dd
                  className={
                    "ss-tabular mt-1 text-[17px] font-semibold " +
                    (tone === "profit" ? "text-[var(--ss-profit)]" : tone === "loss" ? "text-[var(--ss-loss)]" : "")
                  }
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 border-t border-[var(--ss-border)] pt-4">
            <p className="ss-eyebrow !text-[9.5px] mb-3">Monthly returns</p>
            <Bars data={backtestMonths.map((x) => ({ label: x.month, value: x.pct }))} height={120} className="h-[120px] w-full" />
          </div>
        </section>

        {/* verdict + deploy gate */}
        <div className="space-y-4">
          <div className="ss-card border !border-[var(--ss-accent)]/25 !bg-[var(--ss-accent-dim)] p-4">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[var(--ss-accent)]" />
              <p className="text-[13px] font-semibold">AI verdict</p>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
              Strong, stable edge: it beats buy-and-hold by <span className="font-semibold text-[var(--ss-text)]">3.8×</span> with a
              shallower drawdown. The win rate and profit factor hold across all six months — no single
              lucky trade carries it.
            </p>
          </div>

          <div className="ss-card p-4">
            <div className="flex items-center gap-2">
              <Lock size={14} className="text-[var(--ss-gold)]" />
              <p className="text-[13px] font-semibold">Before you automate</p>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--ss-text-muted)]">
              A good backtest isn&rsquo;t mastery. Paper-trade this live for 30 days at ≥80% adherence to
              prove you can run it under real conditions.
            </p>
            <div className="mt-3 mb-1 flex gap-1">
              {[1, 1, 1, 1, 0].map((d, i) => (
                <span
                  key={i}
                  className={"h-1.5 flex-1 rounded-full " + (d ? "bg-[var(--ss-gold)]" : "bg-[var(--ss-surface-active)]")}
                />
              ))}
            </div>
            <p className="font-mono text-[10.5px] text-[var(--ss-text-faint)]">4 of 5 mastery checks · 30 days remaining</p>
            <button type="button" className="ss-btn ss-btn-ghost mt-3 w-full py-2 text-[12.5px]">
              <Bot size={14} /> Start paper-trading
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-[var(--ss-surface)] px-3 py-2.5">
            <Check size={13} className="text-[var(--ss-accent)]" />
            <span className="text-[11.5px] text-[var(--ss-text-muted)]">Past performance never guarantees future results.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
