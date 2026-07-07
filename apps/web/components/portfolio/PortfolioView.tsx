"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AreaLine } from "@/components/charts/AreaLine";
import { Bars } from "@/components/charts/Bars";
import { Badge, PageHeader, Progress, StatTile } from "@/components/app/primitives";
import { Segmented } from "@/components/app/Segmented";
import { cn } from "@/components/ui/cn";
import {
  benchmarkCurve,
  coachInsights,
  equityCurve,
  exposure,
  fmtUsd,
  monthlyReturns,
  portfolioStats as st,
  positions,
} from "@/lib/data/portfolio";
import { AlertTriangle, ArrowUpRight, Plus, Sparkles, TrendUp } from "@/components/ui/icons";

type Range = "1W" | "1M" | "3M" | "ALL";
const rangeOpts: { value: Range; label: string }[] = [
  { value: "1W", label: "1W" },
  { value: "1M", label: "1M" },
  { value: "3M", label: "3M" },
  { value: "ALL", label: "All" },
];
const rangeLen: Record<Range, number> = { "1W": 7, "1M": 30, "3M": 90, ALL: 90 };

const insightTone = {
  loss: { badge: "loss" as const, icon: <AlertTriangle size={15} />, ring: "border-[var(--ss-loss)]/25" },
  warn: { badge: "warn" as const, icon: <AlertTriangle size={15} />, ring: "border-[var(--ss-gold)]/25" },
  accent: { badge: "accent" as const, icon: <Sparkles size={15} />, ring: "border-[var(--ss-accent)]/25" },
};

export function PortfolioView() {
  const [range, setRange] = useState<Range>("3M");

  const { you, spy } = useMemo(() => {
    const n = rangeLen[range];
    return {
      you: equityCurve.slice(-n),
      spy: benchmarkCurve.slice(-n),
    };
  }, [range]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 02 · Portfolio & coaching"
        title="Portfolio"
        subtitle="Your book, your benchmark, and a coach that reads your behavior — not just your P&L."
        actions={
          <Link href="/journal?new=1" className="ss-btn ss-btn-primary px-4 py-2 text-[13px]">
            <Plus size={15} /> Log a trade
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label="Portfolio value"
          value={fmtUsd(st.totalValue)}
          delta={st.dayChangePct}
          sub="today"
        />
        <StatTile
          label="Net return"
          value={`+${st.totalReturnPct}%`}
          tone="profit"
          sub={`SPY +${st.benchmarkReturnPct}%`}
        />
        <StatTile label="Win rate" value={`${st.winRate}%`} sub={`${st.totalTrades} trades`} />
        <StatTile label="Profit factor" value={st.profitFactor.toFixed(1)} delta={11.0} />
      </div>

      {/* equity + side column */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* equity curve */}
        <section className="ss-card overflow-hidden lg:col-span-2">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ss-border)] px-5 py-3.5">
            <div>
              <p className="ss-eyebrow !text-[9.5px]">Equity curve</p>
              <div className="mt-1 flex items-center gap-4 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-[var(--ss-text)]">
                  <span className="h-[3px] w-4 rounded-full bg-[var(--ss-chart-1)]" /> You +
                  {st.totalReturnPct}%
                </span>
                <span className="flex items-center gap-1.5 text-[var(--ss-text-muted)]">
                  <span className="h-[3px] w-4 rounded-full bg-[var(--ss-chart-neutral)]" /> SPY +
                  {st.benchmarkReturnPct}%
                </span>
              </div>
            </div>
            <Segmented options={rangeOpts} value={range} onChange={setRange} size="sm" />
          </header>
          <div className="px-3 pb-3 pt-4">
            <AreaLine
              uid="pf-equity"
              series={[
                { points: you, color: "var(--ss-chart-1)", fill: true, label: "Your portfolio" },
                { points: spy, color: "var(--ss-chart-neutral)", dashed: true, label: "SPY benchmark" },
              ]}
              height={240}
              width={720}
              animate
              className="h-[240px] w-full"
            />
          </div>
        </section>

        {/* exposure */}
        <section className="ss-card overflow-hidden">
          <header className="border-b border-[var(--ss-border)] px-5 py-3.5">
            <p className="ss-eyebrow !text-[9.5px]">Exposure by market</p>
          </header>
          <div className="space-y-4 p-5">
            {exposure.map((e) => (
              <div key={e.label}>
                <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
                  <span className="text-[var(--ss-text-muted)]">{e.label}</span>
                  <span className="ss-tabular font-semibold">{e.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--ss-surface-active)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${e.pct}%`, background: e.tone }}
                  />
                </div>
              </div>
            ))}
            <div className="mt-1 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] p-3">
              <p className="text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
                <span className="font-semibold text-[var(--ss-gold)]">Concentration flag:</span> 49%
                in crypto is above your 40% target. Consider trimming.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* coaching — the differentiator */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--ss-accent)]" />
          <h2 className="font-display text-[15px] font-semibold tracking-tight">
            Behavioral coach
          </h2>
          <span className="font-mono text-[10.5px] text-[var(--ss-text-faint)]">
            · read from your last 96 trades
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {coachInsights.map((ins) => {
            const t = insightTone[ins.tone];
            return (
              <div key={ins.title} className={cn("ss-card border p-4", t.ring)}>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg",
                      ins.tone === "accent"
                        ? "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]"
                        : ins.tone === "warn"
                          ? "bg-[var(--ss-gold-dim)] text-[var(--ss-gold)]"
                          : "bg-[var(--ss-loss-dim)] text-[var(--ss-loss)]"
                    )}
                  >
                    {t.icon}
                  </span>
                  <h3 className="text-[13.5px] font-semibold leading-tight">{ins.title}</h3>
                </div>
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
                  {ins.body}
                </p>
                <p className="ss-tabular mt-3 text-[12px] font-semibold text-[var(--ss-text)]">
                  {ins.metric}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* positions + monthly + stats */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* open positions */}
        <section className="ss-card overflow-hidden lg:col-span-2">
          <header className="flex items-center justify-between border-b border-[var(--ss-border)] px-5 py-3.5">
            <h2 className="font-display text-[15px] font-semibold tracking-tight">Open positions</h2>
            <span className="font-mono text-[11px] text-[var(--ss-text-faint)]">
              {positions.length} holdings
            </span>
          </header>
          <div className="ss-scroll overflow-x-auto">
            <table className="ss-table min-w-[520px]">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th className="text-right">Size</th>
                  <th className="text-right">Value</th>
                  <th className="text-right">P&amp;L</th>
                  <th className="text-right">Weight</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr key={p.symbol}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[13px] font-semibold">{p.symbol}</span>
                        <Badge tone={p.direction === "long" ? "profit" : "loss"}>{p.direction}</Badge>
                      </div>
                    </td>
                    <td className="ss-tabular text-right text-[var(--ss-text-muted)]">{p.size}</td>
                    <td className="ss-tabular text-right">{fmtUsd(p.value)}</td>
                    <td
                      className={cn(
                        "ss-tabular text-right font-semibold",
                        p.pnl >= 0 ? "text-[var(--ss-profit)]" : "text-[var(--ss-loss)]"
                      )}
                    >
                      {fmtUsd(p.pnl, { sign: true })}
                      <span className="ml-1 text-[11px] opacity-70">
                        ({p.pnlPct >= 0 ? "+" : ""}
                        {p.pnlPct}%)
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="hidden w-14 sm:block">
                          <Progress value={p.weight} />
                        </div>
                        <span className="ss-tabular text-[var(--ss-text-muted)]">{p.weight}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* monthly returns + stats */}
        <div className="space-y-5">
          <section className="ss-card overflow-hidden">
            <header className="border-b border-[var(--ss-border)] px-5 py-3.5">
              <p className="ss-eyebrow !text-[9.5px]">Monthly returns</p>
            </header>
            <div className="px-4 py-4">
              <Bars data={monthlyReturns.map((m) => ({ label: m.month, value: m.pct }))} height={130} className="h-[130px] w-full" />
            </div>
          </section>

          <section className="ss-card p-5">
            <p className="ss-eyebrow !text-[9.5px] mb-3">Risk & quality</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5">
              {[
                ["Expectancy", fmtUsd(st.expectancy, { sign: true }), "profit"],
                ["Avg win", fmtUsd(st.avgWin), "profit"],
                ["Avg loss", fmtUsd(-st.avgLoss), "loss"],
                ["Max drawdown", `${st.maxDrawdown}%`, "loss"],
                ["Sharpe", st.sharpe.toFixed(2), null],
                ["Profit factor", st.profitFactor.toFixed(1), null],
              ].map(([k, v, tone]) => (
                <div key={k as string}>
                  <dt className="font-mono text-[9.5px] uppercase tracking-widest text-[var(--ss-text-faint)]">
                    {k}
                  </dt>
                  <dd
                    className={cn(
                      "ss-tabular mt-0.5 text-[15px] font-semibold",
                      tone === "profit" && "text-[var(--ss-profit)]",
                      tone === "loss" && "text-[var(--ss-loss)]"
                    )}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>

      <Link
        href="/journal"
        className="ss-card flex items-center justify-between p-4 transition-colors hover:!bg-[var(--ss-surface-hover)]"
      >
        <div className="flex items-center gap-2.5">
          <TrendUp size={16} className="text-[var(--ss-accent)]" />
          <span className="text-[13.5px] font-medium">
            Review your full trade journal &amp; AI trade reviews
          </span>
        </div>
        <ArrowUpRight size={16} className="text-[var(--ss-text-faint)]" />
      </Link>
    </div>
  );
}
