"use client";

import { useState } from "react";
import { Modal } from "@/components/app/Modal";
import { cn } from "@/components/ui/cn";
import { brokers, type Broker } from "@/lib/data/automation";
import { ArrowRight, Check, Lock, ShieldCheck } from "@/components/ui/icons";

type Step = "choose" | "auth" | "scope" | "done";

export function BrokerConnect({
  open,
  onClose,
  onConnected,
}: {
  open: boolean;
  onClose: () => void;
  onConnected: () => void;
}) {
  const [step, setStep] = useState<Step>("choose");
  const [broker, setBroker] = useState<Broker | null>(brokers[0]);
  const [scope, setScope] = useState<"read" | "trade">("trade");
  const [authing, setAuthing] = useState(false);

  function reset() {
    setStep("choose");
    setAuthing(false);
  }
  function close() {
    onClose();
    setTimeout(reset, 200);
  }

  const titles: Record<Step, string> = {
    choose: "Connect a broker",
    auth: `Authorize ${broker?.name ?? ""}`,
    scope: "Set permissions",
    done: "Broker connected",
  };
  const subtitles: Record<Step, string> = {
    choose: "Demo only — no real keys are requested or stored.",
    auth: "You'll be redirected to sign in securely.",
    scope: "You're always in control of what automations can do.",
    done: "",
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={titles[step]}
      subtitle={subtitles[step] || undefined}
      size="lg"
    >
      {/* stepper */}
      {step !== "done" && (
        <div className="mb-5 flex items-center gap-2">
          {(["choose", "auth", "scope"] as Step[]).map((s, i) => {
            const order: Step[] = ["choose", "auth", "scope"];
            const active = order.indexOf(step) >= i;
            return (
              <div key={s} className="flex flex-1 items-center gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
                    active
                      ? "bg-[var(--ss-accent)] text-[var(--ss-accent-ink)]"
                      : "bg-[var(--ss-surface-active)] text-[var(--ss-text-faint)]"
                  )}
                >
                  {i + 1}
                </span>
                {i < 2 && (
                  <span
                    className={cn(
                      "h-px flex-1",
                      order.indexOf(step) > i ? "bg-[var(--ss-accent)]" : "bg-[var(--ss-border)]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {step === "choose" && (
        <div className="grid grid-cols-2 gap-2.5">
          {brokers.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setBroker(b);
                setStep("auth");
              }}
              className="ss-card flex items-center gap-3 p-3.5 text-left transition-all hover:!border-[var(--ss-accent)]/40"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--ss-surface-active)] font-display text-[13px] font-bold">
                {b.glyph}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{b.name}</p>
                <p className="font-mono text-[10px] text-[var(--ss-text-faint)]">{b.kind}</p>
              </div>
              {b.popular && (
                <span className="ml-auto rounded bg-[var(--ss-accent-dim)] px-1.5 py-0.5 font-mono text-[8.5px] font-semibold uppercase tracking-wider text-[var(--ss-accent)]">
                  Popular
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {step === "auth" && broker && (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ss-surface-active)] font-display text-lg font-bold">
            {broker.glyph}
          </div>
          <p className="mt-4 text-[14px] font-semibold">Sign in to {broker.name}</p>
          <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
            In production this opens {broker.name}&rsquo;s secure OAuth page. Smart Shield never sees
            your password.
          </p>
          <div className="mx-auto mt-5 max-w-xs space-y-2 rounded-xl border border-[var(--ss-border)] bg-[var(--ss-surface)] p-4 text-left">
            <div className="flex items-center gap-2 text-[12px] text-[var(--ss-text-muted)]">
              <Lock size={13} className="text-[var(--ss-accent)]" /> Bank-grade encryption
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[var(--ss-text-muted)]">
              <ShieldCheck size={13} className="text-[var(--ss-accent)]" /> Revoke access anytime
            </div>
          </div>
          <button
            type="button"
            disabled={authing}
            onClick={() => {
              setAuthing(true);
              setTimeout(() => setStep("scope"), 900);
            }}
            className="ss-btn ss-btn-primary mt-5 w-full py-2.5 text-[13.5px] disabled:opacity-70"
          >
            {authing ? "Authorizing…" : (
              <>
                Continue to {broker.name} <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      )}

      {step === "scope" && (
        <div className="space-y-3">
          {[
            {
              id: "read" as const,
              title: "Read-only",
              desc: "Sync positions and balances for analytics. Automations cannot place orders.",
            },
            {
              id: "trade" as const,
              title: "Trade on my behalf",
              desc: "Let mastered strategies place orders, bound by your guardrails and kill switch.",
            },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setScope(opt.id)}
              className={cn(
                "ss-card flex w-full items-start gap-3 p-4 text-left transition-all",
                scope === opt.id && "!border-[var(--ss-accent)] ring-1 ring-[var(--ss-accent)]/30"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  scope === opt.id
                    ? "border-[var(--ss-accent)] bg-[var(--ss-accent)] text-[var(--ss-accent-ink)]"
                    : "border-[var(--ss-border-strong)]"
                )}
              >
                {scope === opt.id && <Check size={12} />}
              </span>
              <div>
                <p className="text-[13.5px] font-semibold">{opt.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--ss-text-muted)]">{opt.desc}</p>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStep("done")}
            className="ss-btn ss-btn-primary mt-1 w-full py-2.5 text-[13.5px]"
          >
            Grant access <ArrowRight size={15} />
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="py-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]">
            <Check size={26} />
          </div>
          <p className="mt-4 font-display text-[18px] font-semibold tracking-tight">
            {broker?.name} connected
          </p>
          <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-[var(--ss-text-muted)]">
            {scope === "trade"
              ? "Mastered strategies can now place orders within your guardrails. The kill switch halts everything instantly."
              : "Positions will sync for analytics. Automations remain read-only."}
          </p>
          <button
            type="button"
            onClick={() => {
              onConnected();
              close();
            }}
            className="ss-btn ss-btn-primary mt-5 w-full py-2.5 text-[13.5px]"
          >
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}
