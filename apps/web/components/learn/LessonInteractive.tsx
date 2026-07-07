"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";
import { Check, Sparkles, X } from "@/components/ui/icons";

export function QuizCard({
  question,
  options,
  answer,
  explanation,
}: {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <div className="ss-card p-5">
      <div className="flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--ss-violet)]" />
        <p className="ss-eyebrow !text-[9.5px] !text-[var(--ss-violet)]">Check your understanding</p>
      </div>
      <p className="mt-2.5 text-[14px] font-medium">{question}</p>
      <div className="mt-4 space-y-2">
        {options.map((opt, i) => {
          const correct = i === answer;
          const chosen = picked === i;
          return (
            <button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-[13px] transition-colors",
                !answered && "border-[var(--ss-border)] hover:border-[var(--ss-border-strong)] hover:bg-[var(--ss-surface)]",
                answered && correct && "border-[var(--ss-accent)]/40 bg-[var(--ss-accent-dim)] text-[var(--ss-text)]",
                answered && chosen && !correct && "border-[var(--ss-loss)]/40 bg-[var(--ss-loss-dim)]",
                answered && !correct && !chosen && "border-[var(--ss-border)] opacity-55"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                  answered && correct
                    ? "border-[var(--ss-accent)] bg-[var(--ss-accent)] text-[var(--ss-accent-ink)]"
                    : answered && chosen
                      ? "border-[var(--ss-loss)] text-[var(--ss-loss)]"
                      : "border-[var(--ss-border-strong)] text-[var(--ss-text-faint)]"
                )}
              >
                {answered && correct ? <Check size={12} /> : answered && chosen ? <X size={11} /> : String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="ss-animate-in mt-3.5 rounded-lg bg-[var(--ss-surface)] p-3 text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">
          {picked === answer ? "Correct — " : "Not quite. "}
          {explanation}
        </p>
      )}
    </div>
  );
}

export function MarkComplete({ xp }: { xp: number }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone(true)}
      disabled={done}
      className={cn(
        "ss-btn w-full py-2.5 text-[14px]",
        done ? "ss-btn-ghost !text-[var(--ss-accent)]" : "ss-btn-primary"
      )}
    >
      {done ? (
        <>
          <Check size={16} /> Completed · +{xp} XP earned
        </>
      ) : (
        <>Mark lesson complete · +{xp} XP</>
      )}
    </button>
  );
}
