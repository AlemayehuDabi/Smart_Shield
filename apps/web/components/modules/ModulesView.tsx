"use client";

import { useState } from "react";
import type { ModuleCard } from "@/lib/mock-data";
import { cn } from "@/components/ui/cn";

const statusLabel: Record<ModuleCard["status"], string> = {
  active: "Active",
  standby: "Standby",
  learning: "Learning",
};

interface ModulesViewProps {
  modules: ModuleCard[];
}

export function ModulesView({ modules }: ModulesViewProps) {
  const [selected, setSelected] = useState<string | null>(modules[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight text-[var(--ss-text)]">Modular system</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--ss-text-muted)]">
          Independent subsystems with isolated failure domains — tap a module to focus telemetry and controls.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((m) => {
          const isSel = selected === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(m.id)}
              className={cn(
                "ss-card text-left transition duration-200",
                "hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65)]",
                isSel && "ring-1 ring-[var(--ss-accent)]/35",
              )}
            >
              <div className="border-b border-[var(--ss-border)] px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--ss-text)]">{m.name}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-[10px]",
                      m.status === "active" && "bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]",
                      m.status === "learning" && "bg-[var(--ss-violet-dim)] text-[var(--ss-violet)]",
                      m.status === "standby" && "bg-[var(--ss-surface)] text-[var(--ss-text-faint)]",
                    )}
                  >
                    {statusLabel[m.status]}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--ss-text-muted)]">{m.description}</p>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between text-[11px] text-[var(--ss-text-faint)]">
                  <span>Load</span>
                  <span className="font-mono text-[var(--ss-text-muted)]">{m.load}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--ss-bg)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--ss-accent)]/80 to-[var(--ss-violet)]/80 transition-all duration-500"
                    style={{ width: `${m.load}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
