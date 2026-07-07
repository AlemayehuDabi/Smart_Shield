"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";
import { builderPalette as pal } from "@/lib/data/automation";
import { ArrowRight, Bot, Check, Play, Plus, Sparkles, X, Zap } from "@/components/ui/icons";

type Condition = { id: string; indicator: string; operator: string; value: string };

let seq = 0;
const uid = () => `c${++seq}`;

const initial: Condition[] = [
  { id: uid(), indicator: "RSI(14)", operator: "<", value: "30" },
  { id: uid(), indicator: "EMA(200)", operator: "crosses above", value: "price" },
];

export function StrategyBuilder({ onRunBacktest }: { onRunBacktest: () => void }) {
  const [name, setName] = useState("Mean-reversion · BTC");
  const [symbol, setSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("4H");
  const [action, setAction] = useState("LONG");
  const [risk, setRisk] = useState("1");
  const [target, setTarget] = useState("EMA(20)");
  const [stop, setStop] = useState("1R");
  const [conditions, setConditions] = useState<Condition[]>(initial);
  const [dragOver, setDragOver] = useState(false);

  function addCondition(indicator = pal.indicators[0]) {
    setConditions((prev) => [...prev, { id: uid(), indicator, operator: ">", value: "" }]);
  }
  function updateCondition(id: string, patch: Partial<Condition>) {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function removeCondition(id: string) {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }

  const compiled = [
    ...conditions.map(
      (c, i) => `${i === 0 ? "IF   " : "AND  "}${c.indicator} ${c.operator} ${c.value || "…"}`
    ),
    `THEN ${action} · risk ${risk}%`,
    `EXIT at ${target} or −${stop}`,
  ].join("\n");

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      {/* canvas */}
      <div className="space-y-5">
        {/* meta */}
        <section className="ss-card p-5">
          <p className="ss-eyebrow !text-[9.5px] mb-3">Strategy</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="col-span-2 block">
              <span className="ss-label">Name</span>
              <input className="ss-input" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block">
              <span className="ss-label">Instrument</span>
              <input className="ss-input ss-tabular" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            </label>
            <label className="block">
              <span className="ss-label">Timeframe</span>
              <select className="ss-input" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                {["15m", "1H", "4H", "1D"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* entry conditions — drop zone */}
        <section
          className={cn(
            "ss-card p-5 transition-colors",
            dragOver && "!border-[var(--ss-accent)] !bg-[var(--ss-accent-dim)]"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const ind = e.dataTransfer.getData("text/indicator");
            if (ind) addCondition(ind);
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="ss-eyebrow !text-[9.5px]">Entry conditions</p>
            <span className="font-mono text-[10px] text-[var(--ss-text-faint)]">drag or click to add →</span>
          </div>

          <div className="space-y-2">
            {conditions.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2">
                <span className="w-9 shrink-0 font-mono text-[10px] font-semibold uppercase text-[var(--ss-text-faint)]">
                  {i === 0 ? "IF" : "AND"}
                </span>
                <select
                  className="ss-input !py-1.5 !text-[12.5px]"
                  value={c.indicator}
                  onChange={(e) => updateCondition(c.id, { indicator: e.target.value })}
                >
                  {pal.indicators.map((ind) => (
                    <option key={ind}>{ind}</option>
                  ))}
                </select>
                <select
                  className="ss-input w-auto !py-1.5 !text-[12.5px]"
                  value={c.operator}
                  onChange={(e) => updateCondition(c.id, { operator: e.target.value })}
                >
                  {pal.operators.map((op) => (
                    <option key={op}>{op}</option>
                  ))}
                </select>
                <input
                  className="ss-input ss-tabular !py-1.5 !text-[12.5px]"
                  placeholder="value"
                  value={c.value}
                  onChange={(e) => updateCondition(c.id, { value: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeCondition(c.id)}
                  aria-label="Remove condition"
                  className="ss-btn ss-btn-ghost h-8 w-8 shrink-0 !p-0"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addCondition()}
            className="ss-btn ss-btn-ghost mt-3 w-full border-dashed py-2 text-[12.5px]"
          >
            <Plus size={14} /> Add condition
          </button>
        </section>

        {/* action + exits */}
        <section className="ss-card p-5">
          <p className="ss-eyebrow !text-[9.5px] mb-3">Action &amp; exits</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="ss-label">Then</span>
              <select className="ss-input" value={action} onChange={(e) => setAction(e.target.value)}>
                {pal.actions.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="ss-label">Risk / trade</span>
              <div className="relative">
                <input className="ss-input ss-tabular pr-7" value={risk} onChange={(e) => setRisk(e.target.value)} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[var(--ss-text-faint)]">%</span>
              </div>
            </label>
            <label className="block">
              <span className="ss-label">Target</span>
              <input className="ss-input" value={target} onChange={(e) => setTarget(e.target.value)} />
            </label>
          </div>
          <label className="mt-3 block max-w-[33%]">
            <span className="ss-label">Stop</span>
            <input className="ss-input ss-tabular" value={stop} onChange={(e) => setStop(e.target.value)} />
          </label>
        </section>

        {/* compiled + guardrails */}
        <section className="ss-card overflow-hidden">
          <header className="flex items-center gap-2 border-b border-[var(--ss-border)] px-5 py-3">
            <Sparkles size={14} className="text-[var(--ss-accent)]" />
            <p className="ss-eyebrow !text-[9.5px]">Compiled strategy</p>
          </header>
          <pre className="ss-scroll overflow-x-auto bg-[var(--ss-bg-deep)] px-5 py-4 font-mono text-[12px] leading-relaxed text-[var(--ss-text-muted)]">
            {compiled}
          </pre>
          <div className="flex items-center gap-2.5 border-t border-[var(--ss-border)] bg-[var(--ss-surface)] px-5 py-3.5">
            <Check size={14} className="text-[var(--ss-accent)]" />
            <p className="text-[12px] text-[var(--ss-text-muted)]">
              Guardrails auto-attached: max drawdown −8%, daily loss cap $250, 1 concurrent position.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={onRunBacktest} className="ss-btn ss-btn-primary px-5 py-2.5 text-[13.5px]">
            <Play size={15} /> Run backtest
          </button>
          <button type="button" className="ss-btn ss-btn-ghost px-4 py-2.5 text-[13.5px]">
            Save draft
          </button>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--ss-gold)]">
            <Bot size={13} /> Live deploy unlocks after mastery
          </span>
        </div>
      </div>

      {/* palette */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="ss-card p-4">
          <p className="ss-eyebrow !text-[9.5px] mb-3">Indicators</p>
          <div className="grid grid-cols-2 gap-2">
            {pal.indicators.map((ind) => (
              <button
                key={ind}
                type="button"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/indicator", ind)}
                onClick={() => addCondition(ind)}
                className="flex cursor-grab items-center gap-1.5 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] px-2.5 py-2 text-left font-mono text-[11px] text-[var(--ss-text-muted)] transition-colors hover:border-[var(--ss-accent)]/40 hover:text-[var(--ss-text)] active:cursor-grabbing"
              >
                <span className="text-[var(--ss-text-faint)]">⠿</span>
                {ind}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--ss-border)] bg-[var(--ss-surface)] p-3">
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-[var(--ss-accent)]" />
              <p className="text-[12px] font-semibold">Backtest before you trust it</p>
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-[var(--ss-text-muted)]">
              Every rule you add updates the compiled strategy. Run a backtest to see how it would have
              performed — then paper-trade to unlock live automation.
            </p>
            <button
              type="button"
              onClick={onRunBacktest}
              className="mt-2.5 inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold text-[var(--ss-accent)] hover:underline"
            >
              Run backtest <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
