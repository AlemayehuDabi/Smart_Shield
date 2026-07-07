"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/components/ui/cn";
import {
  ArrowRight,
  Bot,
  ChartCandle,
  Check,
  GraduationCap,
  LogoMark,
  PieChart,
  Scale,
  Target,
  TrendUp,
  Zap,
} from "@/components/ui/icons";

type Step = {
  key: string;
  question: string;
  helper: string;
  multi?: boolean;
  options: { value: string; label: string; desc: string; icon: React.ReactNode }[];
};

const steps: Step[] = [
  {
    key: "experience",
    question: "How would you describe your trading?",
    helper: "We tune signal depth and lesson difficulty to match.",
    options: [
      { value: "new", label: "Just starting", desc: "New to charts and terms", icon: <GraduationCap size={18} /> },
      { value: "some", label: "Some experience", desc: "I've placed real trades", icon: <TrendUp size={18} /> },
      { value: "seasoned", label: "Seasoned", desc: "I trade with a plan", icon: <Target size={18} /> },
      { value: "pro", label: "Advanced", desc: "I want automation & edge", icon: <Zap size={18} /> },
    ],
  },
  {
    key: "markets",
    question: "Which markets do you trade?",
    helper: "Pick all that apply — your signal feed filters to these.",
    multi: true,
    options: [
      { value: "crypto", label: "Crypto", desc: "BTC, ETH, alts", icon: <ChartCandle size={18} /> },
      { value: "stocks", label: "Stocks", desc: "Equities & ETFs", icon: <TrendUp size={18} /> },
      { value: "fx", label: "Forex", desc: "Major & minor pairs", icon: <Scale size={18} /> },
      { value: "options", label: "Options", desc: "Calls, puts, spreads", icon: <PieChart size={18} /> },
    ],
  },
  {
    key: "goal",
    question: "What matters most right now?",
    helper: "This orders your home screen and coaching focus.",
    options: [
      { value: "learn", label: "Understand markets", desc: "Learn why, not just what", icon: <GraduationCap size={18} /> },
      { value: "consistent", label: "Get consistent", desc: "Fix leaks, build a process", icon: <Target size={18} /> },
      { value: "benchmark", label: "Beat my benchmark", desc: "Outperform buy & hold", icon: <TrendUp size={18} /> },
      { value: "automate", label: "Automate strategies", desc: "Run what I've mastered", icon: <Bot size={18} /> },
    ],
  },
  {
    key: "risk",
    question: "How much risk fits you?",
    helper: "Sets default position-size and guardrail suggestions.",
    options: [
      { value: "conservative", label: "Conservative", desc: "Protect capital first", icon: <Scale size={18} /> },
      { value: "balanced", label: "Balanced", desc: "Measured, asymmetric bets", icon: <Target size={18} /> },
      { value: "aggressive", label: "Aggressive", desc: "Higher risk for higher reward", icon: <Zap size={18} /> },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const done = i >= steps.length;

  const step = steps[i];
  const current = step ? (answers[step.key] ?? []) : [];
  const canContinue = current.length > 0;
  const progress = Math.round((Math.min(i, steps.length) / steps.length) * 100);

  function toggle(value: string) {
    if (!step) return;
    setAnswers((prev) => {
      const sel = prev[step.key] ?? [];
      if (step.multi) {
        return {
          ...prev,
          [step.key]: sel.includes(value) ? sel.filter((v) => v !== value) : [...sel, value],
        };
      }
      return { ...prev, [step.key]: [value] };
    });
    if (!step.multi) {
      // auto-advance on single-select
      setTimeout(() => setI((n) => n + 1), 260);
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="ss-backdrop" aria-hidden>
        <div className="ss-grid" />
        <div className="ss-noise" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-5 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-[var(--ss-text)]">
            <LogoMark size={24} />
            <span className="font-display text-[14px] font-semibold tracking-tight">Smart Shield</span>
          </Link>
          <span className="font-mono text-[11px] text-[var(--ss-text-faint)]">
            {done ? "Done" : `Step ${i + 1} of ${steps.length}`}
          </span>
        </div>

        {/* progress */}
        <div className="mt-5 h-1 overflow-hidden rounded-full bg-[var(--ss-surface-active)]">
          <div
            className="h-full rounded-full bg-[var(--ss-accent)] transition-[width] duration-500"
            style={{ width: `${done ? 100 : progress}%` }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          {done ? (
            <ResultCard answers={answers} onEnter={() => router.push("/signals")} />
          ) : (
            <div key={step.key} className="ss-animate-in">
              <h1 className="font-display text-[1.7rem] font-semibold leading-tight tracking-tight">
                {step.question}
              </h1>
              <p className="mt-2 text-[13.5px] text-[var(--ss-text-muted)]">{step.helper}</p>

              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {step.options.map((opt) => {
                  const selected = current.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggle(opt.value)}
                      aria-pressed={selected}
                      className={cn(
                        "ss-card flex items-start gap-3 p-4 text-left transition-all",
                        selected &&
                          "!border-[var(--ss-accent)] !bg-[var(--ss-accent-dim)] ring-1 ring-[var(--ss-accent)]/30"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                          selected
                            ? "bg-[var(--ss-accent)] text-[var(--ss-accent-ink)]"
                            : "bg-[var(--ss-surface-active)] text-[var(--ss-text-muted)]"
                        )}
                      >
                        {selected ? <Check size={17} /> : opt.icon}
                      </span>
                      <span>
                        <span className="block text-[14px] font-semibold">{opt.label}</span>
                        <span className="mt-0.5 block text-[12px] text-[var(--ss-text-muted)]">
                          {opt.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setI((n) => Math.max(0, n - 1))}
                  disabled={i === 0}
                  className="ss-btn ss-btn-ghost px-4 py-2 text-[13px] disabled:opacity-40"
                >
                  Back
                </button>
                {step.multi && (
                  <button
                    type="button"
                    onClick={() => setI((n) => n + 1)}
                    disabled={!canContinue}
                    className="ss-btn ss-btn-primary px-5 py-2 text-[13px] disabled:opacity-50"
                  >
                    Continue <ArrowRight size={15} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  answers,
  onEnter,
}: {
  answers: Record<string, string[]>;
  onEnter: () => void;
}) {
  const summary = useMemo(() => {
    const markets = (answers.markets ?? []).length;
    const goal = answers.goal?.[0];
    const goalCopy: Record<string, string> = {
      learn: "a learning-first feed with lessons surfaced in context",
      consistent: "behavioral coaching tuned to your process leaks",
      benchmark: "benchmark analytics front-and-center",
      automate: "a path toward guarded automation once you've mastered a strategy",
    };
    return { markets, goalText: goal ? goalCopy[goal] : "a balanced starting feed" };
  }, [answers]);

  return (
    <div className="ss-animate-in text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ss-accent-dim)] text-[var(--ss-accent)]">
        <Check size={26} />
      </div>
      <h1 className="font-display mt-5 text-[1.8rem] font-semibold tracking-tight">
        Your desk is ready
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[var(--ss-text-muted)]">
        We&rsquo;ve set you up with {summary.goalText}
        {summary.markets > 0 ? `, filtered to your ${summary.markets} chosen market${summary.markets === 1 ? "" : "s"}` : ""}.
        You can change any of this in Settings.
      </p>

      <div className="ss-card mt-6 space-y-2.5 p-4 text-left">
        {[
          "3 fresh signals waiting in your feed",
          "First lesson queued: Support & resistance",
          "Journal ready — log your first trade to activate coaching",
        ].map((line) => (
          <div key={line} className="flex items-center gap-2.5 text-[13px]">
            <Check size={15} className="shrink-0 text-[var(--ss-accent)]" />
            <span className="text-[var(--ss-text-muted)]">{line}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onEnter}
        className="ss-btn ss-btn-primary mt-6 w-full py-2.5 text-[14px]"
      >
        Enter Smart Shield <ArrowRight size={16} />
      </button>
    </div>
  );
}
