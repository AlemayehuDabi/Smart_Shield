"use client";

import { useState } from "react";
import { PageHeader } from "@/components/app/primitives";
import { Segmented } from "@/components/app/Segmented";
import { ControlPanel } from "./ControlPanel";
import { StrategyBuilder } from "./StrategyBuilder";
import { BacktestView } from "./BacktestView";
import { BrokerConnect } from "./BrokerConnect";
import { strategies as seed, type Strategy } from "@/lib/data/automation";
import { Bot } from "@/components/ui/icons";

type Tab = "control" | "build" | "backtest";

export function AutomationView() {
  const [tab, setTab] = useState<Tab>("control");
  const [list, setList] = useState<Strategy[]>(seed);
  const [killed, setKilled] = useState(false);
  const [brokerConnected, setBrokerConnected] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);

  function toggleStrategy(id: string) {
    setList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "live" ? "paused" : s.status === "paused" ? "live" : s.status }
          : s
      )
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 04 · Automation"
        title="Automation"
        subtitle="Automate the strategies you've proven you understand — inside guardrails you set, with a kill switch that always wins."
        actions={
          <span className="hidden items-center gap-1.5 rounded-lg bg-[var(--ss-gold-dim)] px-3 py-2 font-mono text-[11px] font-semibold text-[var(--ss-gold)] sm:inline-flex">
            <Bot size={14} /> Elite
          </span>
        }
      />

      <Segmented
        options={[
          { value: "control", label: "Control panel" },
          { value: "build", label: "Strategy builder" },
          { value: "backtest", label: "Backtest" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "control" && (
        <ControlPanel
          strategies={list}
          killed={killed}
          onToggle={toggleStrategy}
          onToggleKill={() => setKilled((k) => !k)}
          brokerConnected={brokerConnected}
          onOpenBroker={() => setBrokerOpen(true)}
          onGoBacktest={() => setTab("backtest")}
        />
      )}
      {tab === "build" && <StrategyBuilder onRunBacktest={() => setTab("backtest")} />}
      {tab === "backtest" && <BacktestView onEdit={() => setTab("build")} />}

      <BrokerConnect
        open={brokerOpen}
        onClose={() => setBrokerOpen(false)}
        onConnected={() => setBrokerConnected(true)}
      />
    </div>
  );
}
