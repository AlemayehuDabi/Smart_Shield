"use client";

import { useState } from "react";
import { emotions, setups, type Trade, type TradeStatus } from "@/lib/data/portfolio";

type Draft = {
  symbol: string;
  market: Trade["market"];
  direction: Trade["direction"];
  status: TradeStatus;
  entry: string;
  exit: string;
  size: string;
  setup: string;
  emotion: string;
  adherence: number;
  notes: string;
};

function toDraft(t?: Trade | null): Draft {
  return {
    symbol: t?.symbol ?? "",
    market: t?.market ?? "crypto",
    direction: t?.direction ?? "long",
    status: t?.status ?? "open",
    entry: t?.entry?.toString() ?? "",
    exit: t?.exit?.toString() ?? "",
    size: t?.size?.toString() ?? "",
    setup: t?.setup ?? setups[0],
    emotion: t?.emotion ?? emotions[0],
    adherence: t?.adherence ?? 80,
    notes: t?.notes ?? "",
  };
}

export function TradeForm({
  initial,
  formId,
  onSave,
}: {
  initial?: Trade | null;
  formId: string;
  onSave: (t: Trade) => void;
}) {
  const [d, setD] = useState<Draft>(toDraft(initial));
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const isOpen = d.status === "open";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const entry = parseFloat(d.entry) || 0;
    const exit = d.exit ? parseFloat(d.exit) : undefined;
    const size = parseFloat(d.size) || 0;
    const notional = entry * size;
    let pnl: number | undefined;
    let pnlPct: number | undefined;
    if (!isOpen && exit) {
      const raw = d.direction === "long" ? exit - entry : entry - exit;
      pnlPct = entry ? (raw / entry) * 100 : 0;
      pnl = raw * size;
    }
    const trade: Trade = {
      id: initial?.id ?? `t-${Date.now()}`,
      symbol: d.symbol.trim().toUpperCase() || "—",
      market: d.market,
      direction: d.direction,
      status: d.status,
      entry,
      exit,
      size,
      notional,
      pnl,
      pnlPct: pnlPct != null ? Math.round(pnlPct * 10) / 10 : undefined,
      rMultiple: initial?.rMultiple,
      openedAt: initial?.openedAt ?? new Date().toISOString().slice(0, 10),
      closedAt: !isOpen ? (initial?.closedAt ?? new Date().toISOString().slice(0, 10)) : undefined,
      setup: d.setup,
      emotion: d.emotion,
      adherence: d.adherence,
      notes: d.notes.trim(),
    };
    onSave(trade);
  }

  return (
    <form id={formId} onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 block sm:col-span-1">
          <span className="ss-label">Symbol</span>
          <input
            className="ss-input"
            required
            placeholder="BTC/USDT"
            value={d.symbol}
            onChange={(e) => set("symbol", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="ss-label">Market</span>
          <select className="ss-input" value={d.market} onChange={(e) => set("market", e.target.value as Trade["market"])}>
            <option value="crypto">Crypto</option>
            <option value="stocks">Stocks</option>
            <option value="fx">Forex</option>
          </select>
        </label>
        <label className="block">
          <span className="ss-label">Direction</span>
          <select className="ss-input" value={d.direction} onChange={(e) => set("direction", e.target.value as Trade["direction"])}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </label>
        <label className="block">
          <span className="ss-label">Status</span>
          <select className="ss-input" value={d.status} onChange={(e) => set("status", e.target.value as TradeStatus)}>
            <option value="open">Open</option>
            <option value="win">Closed · Win</option>
            <option value="loss">Closed · Loss</option>
            <option value="breakeven">Breakeven</option>
          </select>
        </label>
        <label className="block">
          <span className="ss-label">Size (units)</span>
          <input className="ss-input ss-tabular" type="number" step="any" required placeholder="0.1" value={d.size} onChange={(e) => set("size", e.target.value)} />
        </label>
        <label className="block">
          <span className="ss-label">Entry price</span>
          <input className="ss-input ss-tabular" type="number" step="any" required placeholder="0.00" value={d.entry} onChange={(e) => set("entry", e.target.value)} />
        </label>
        <label className="block">
          <span className="ss-label">Exit price {isOpen && <span className="font-normal text-[var(--ss-text-faint)]">(open)</span>}</span>
          <input className="ss-input ss-tabular" type="number" step="any" disabled={isOpen} placeholder={isOpen ? "—" : "0.00"} value={isOpen ? "" : d.exit} onChange={(e) => set("exit", e.target.value)} />
        </label>
        <label className="block">
          <span className="ss-label">Setup</span>
          <select className="ss-input" value={d.setup} onChange={(e) => set("setup", e.target.value)}>
            {setups.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="ss-label">How you felt</span>
          <select className="ss-input" value={d.emotion} onChange={(e) => set("emotion", e.target.value)}>
            {emotions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="ss-label flex items-center justify-between">
          Plan adherence
          <span className="ss-tabular font-mono text-[12px] text-[var(--ss-accent)]">{d.adherence}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={d.adherence}
          onChange={(e) => set("adherence", Number(e.target.value))}
          className="mt-1 w-full accent-[var(--ss-accent)]"
        />
      </label>

      <label className="block">
        <span className="ss-label">Notes — what did you see, and what would you do again?</span>
        <textarea
          className="ss-input min-h-[90px] resize-y"
          placeholder="e.g. Waited for the retest instead of chasing…"
          value={d.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </label>
    </form>
  );
}
