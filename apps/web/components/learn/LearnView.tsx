"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader, Progress } from "@/components/app/primitives";
import { Segmented } from "@/components/app/Segmented";
import { cn } from "@/components/ui/cn";
import {
  learnProgress as lp,
  lessons,
  tracks,
  type Lesson,
  type LessonLevel,
} from "@/lib/data/lessons";
import { Bot, Check, Clock, Flame, GraduationCap, Lock, Play, Sparkles } from "@/components/ui/icons";

type LevelFilter = "all" | LessonLevel;

const accentVar: Record<string, string> = {
  accent: "var(--ss-accent)",
  violet: "var(--ss-violet)",
  gold: "var(--ss-gold)",
};

function LessonCard({ lesson, highlight }: { lesson: Lesson; highlight: boolean }) {
  const locked = lesson.status === "locked";
  const done = lesson.status === "done";
  const inProgress = lesson.status === "in-progress";

  const inner = (
    <div
      className={cn(
        "ss-card h-full p-4 transition-all",
        highlight && "!border-[var(--ss-violet)] ring-2 ring-[var(--ss-violet)]/30",
        locked && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            done
              ? "bg-[var(--ss-accent)] text-[var(--ss-accent-ink)]"
              : locked
                ? "bg-[var(--ss-surface-active)] text-[var(--ss-text-faint)]"
                : "bg-[var(--ss-violet-dim)] text-[var(--ss-violet)]"
          )}
        >
          {done ? <Check size={17} /> : locked ? <Lock size={15} /> : <GraduationCap size={16} />}
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] text-[var(--ss-text-faint)]">
          <span className="flex items-center gap-1">
            <Clock size={11} /> {lesson.minutes}m
          </span>
          <span className="text-[var(--ss-violet)]">+{lesson.xp} XP</span>
        </span>
      </div>

      <h3 className="mt-3 font-display text-[14.5px] font-semibold tracking-tight">{lesson.title}</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--ss-text-muted)]">{lesson.blurb}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="ss-chip !py-0.5 !text-[9.5px]">{lesson.level}</span>
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold",
            done
              ? "text-[var(--ss-accent)]"
              : locked
                ? "text-[var(--ss-text-faint)]"
                : "text-[var(--ss-violet)]"
          )}
        >
          {done ? (
            "Completed"
          ) : locked ? (
            "Locked"
          ) : inProgress ? (
            <>
              <Play size={11} /> Resume
            </>
          ) : (
            <>
              <Play size={11} /> Start
            </>
          )}
        </span>
      </div>
    </div>
  );

  if (locked) return <div>{inner}</div>;
  return (
    <Link href={`/learn/${lesson.id}`} id={`lesson-${lesson.id}`} className="block">
      {inner}
    </Link>
  );
}

export function LearnView() {
  const params = useSearchParams();
  const highlightId = params.get("c");
  const [level, setLevel] = useState<LevelFilter>("all");

  const visible = useMemo(
    () => lessons.filter((l) => level === "all" || l.level === level),
    [level]
  );

  const nextUp = lessons.find((l) => l.status === "in-progress") ?? lessons.find((l) => l.status === "available");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pillar 03 · Education"
        title="Learn"
        subtitle="Concepts taught the moment they matter — every signal links to the exact lesson behind it."
      />

      {highlightId && (
        <div className="ss-card flex items-center gap-3 border !border-[var(--ss-violet)]/30 !bg-[var(--ss-violet-dim)] p-3.5">
          <Sparkles size={16} className="shrink-0 text-[var(--ss-violet)]" />
          <p className="text-[13px] text-[var(--ss-text-muted)]">
            You came here from a signal. The highlighted lesson below explains the concept it used.
          </p>
        </div>
      )}

      {/* progress panel */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="ss-card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ss-violet-dim)] text-[var(--ss-violet)]">
                <GraduationCap size={26} />
              </div>
              <div>
                <p className="ss-eyebrow !text-[9px]">Current rank</p>
                <p className="font-display text-xl font-semibold tracking-tight">{lp.rank}</p>
                <p className="mt-0.5 font-mono text-[11px] text-[var(--ss-text-faint)]">
                  {lp.lessonsDone} of {lp.lessonsTotal} lessons complete
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="flex items-center gap-1 text-[var(--ss-gold)]">
                  <Flame size={16} />
                  <span className="ss-tabular font-display text-xl font-semibold">{lp.streakDays}</span>
                </div>
                <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-widest text-[var(--ss-text-faint)]">
                  day streak
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[12px]">
              <span className="text-[var(--ss-text-muted)]">XP to next rank · Strategist</span>
              <span className="ss-tabular font-semibold text-[var(--ss-violet)]">
                {lp.xp} / {lp.xpToNext}
              </span>
            </div>
            <Progress value={(lp.xp / lp.xpToNext) * 100} tone="violet" />
          </div>
        </div>

        {/* next up + automation tie-in */}
        <div className="space-y-3">
          {nextUp && (
            <Link href={`/learn/${nextUp.id}`} className="ss-card block p-4 transition-colors hover:!bg-[var(--ss-surface-hover)]">
              <p className="ss-eyebrow !text-[9px] !text-[var(--ss-violet)]">Continue learning</p>
              <p className="mt-1.5 font-display text-[15px] font-semibold tracking-tight">{nextUp.title}</p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[var(--ss-violet)] px-3 py-1.5 text-[12px] font-semibold text-white">
                <Play size={13} /> Resume · {nextUp.minutes} min
              </div>
            </Link>
          )}
          <div className="ss-card flex items-start gap-3 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--ss-gold-dim)] text-[var(--ss-gold)]">
              <Bot size={16} />
            </span>
            <p className="text-[12px] leading-relaxed text-[var(--ss-text-muted)]">
              <span className="font-semibold text-[var(--ss-text)]">Mastery unlocks automation.</span>{" "}
              Completing a track proves you understand a strategy before you&rsquo;re allowed to
              automate it.
            </p>
          </div>
        </div>
      </div>

      {/* level filter */}
      <div className="flex items-center gap-2.5">
        <Segmented
          options={[
            { value: "all", label: "All levels" },
            { value: "Foundation", label: "Foundation" },
            { value: "Intermediate", label: "Intermediate" },
            { value: "Advanced", label: "Advanced" },
          ]}
          value={level}
          onChange={setLevel}
          size="sm"
        />
      </div>

      {/* tracks */}
      <div className="space-y-8">
        {tracks.map((track) => {
          const trackLessons = visible.filter((l) => l.trackId === track.id);
          if (trackLessons.length === 0) return null;
          const done = trackLessons.filter((l) => l.status === "done").length;
          return (
            <section key={track.id}>
              <div className="mb-3 flex items-end justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-4 w-1 rounded-full"
                    style={{ background: accentVar[track.accent] }}
                  />
                  <div>
                    <h2 className="font-display text-[16px] font-semibold tracking-tight">{track.name}</h2>
                    <p className="text-[12.5px] text-[var(--ss-text-muted)]">{track.description}</p>
                  </div>
                </div>
                <span className="ss-tabular shrink-0 font-mono text-[11px] text-[var(--ss-text-faint)]">
                  {done}/{trackLessons.length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {trackLessons.map((l) => (
                  <LessonCard key={l.id} lesson={l} highlight={highlightId === l.id} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
