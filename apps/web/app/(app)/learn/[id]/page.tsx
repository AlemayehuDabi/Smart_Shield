import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuizCard, MarkComplete } from "@/components/learn/LessonInteractive";
import { Badge } from "@/components/app/primitives";
import { lessons, lessonById, tracks } from "@/lib/data/lessons";
import { signals } from "@/lib/data/signals";
import { ArrowRight, BookOpen, Check, Clock, Pulse } from "@/components/ui/icons";

type Content = {
  keyPoints: string[];
  quiz: { question: string; options: string[]; answer: number; explanation: string };
};

const content: Record<string, Content> = {
  "support-resistance": {
    keyPoints: [
      "Levels form where buyers or sellers repeatedly step in — memory, not magic.",
      "The more times a level is tested, the more traders watch it, which makes it self-reinforcing.",
      "A broken level often flips role: old resistance becomes new support (a 'flip').",
    ],
    quiz: {
      question: "Price breaks above a resistance level, pulls back to it, and holds. What is this?",
      options: ["A fakeout", "A support/resistance flip", "A divergence", "A volatility squeeze"],
      answer: 1,
      explanation: "When old resistance holds as new support on the retest, the level has flipped — one of the highest-probability continuation entries.",
    },
  },
  "candlestick-patterns": {
    keyPoints: [
      "A candle encodes the battle between buyers and sellers within one period.",
      "Long wicks show rejection; a small body shows indecision.",
      "Patterns matter most at key levels — an engulfing at support beats one in no-man's-land.",
    ],
    quiz: {
      question: "A bullish engulfing candle is most meaningful when it appears…",
      options: ["In the middle of a range", "At a tested support level", "After three green candles", "On low volume"],
      answer: 1,
      explanation: "Context is everything. The same pattern at a defended support level carries far more weight than one floating mid-range.",
    },
  },
  ema: {
    keyPoints: [
      "An EMA weights recent prices more heavily, so it reacts faster than a simple average.",
      "Price riding an EMA (e.g. the 21) signals an intact trend; repeated reclaims show demand.",
      "The 50/200 relationship frames the bigger trend regime.",
    ],
    quiz: {
      question: "Price keeps dipping to the 21-EMA and bouncing. This suggests…",
      options: ["The trend is broken", "Buyers are defending the trend", "A reversal is imminent", "Volume is drying up"],
      answer: 1,
      explanation: "Dips being bought at a rising EMA is textbook trend continuation — demand is stepping in on schedule.",
    },
  },
  "volume-analysis": {
    keyPoints: [
      "Volume is participation — it tells you whether a move has conviction.",
      "Breakouts on rising volume are trustworthy; the same move on thin volume often fails.",
      "Declining volume in a consolidation means holders aren't selling — supply is thin.",
    ],
    quiz: {
      question: "A breakout occurs on volume well below average. You should…",
      options: ["Buy aggressively", "Be skeptical — it may fail", "Ignore volume entirely", "Short it immediately"],
      answer: 1,
      explanation: "Thin breakouts lack participation and frequently reverse. Volume confirmation is what separates a real move from a trap.",
    },
  },
  "rsi-divergence": {
    keyPoints: [
      "RSI measures the speed and size of recent price moves (momentum).",
      "Bullish divergence: price makes a lower low, RSI makes a higher low — sellers are exhausting.",
      "Divergence is a warning, not a trigger — wait for price to confirm.",
    ],
    quiz: {
      question: "Price prints a new high but RSI makes a lower high. This is…",
      options: ["Bullish divergence", "Bearish divergence", "A squeeze", "Confirmation"],
      answer: 1,
      explanation: "When price climbs but momentum fades, that's bearish divergence — buyers are running out of steam beneath the surface.",
    },
  },
  "volatility-squeeze": {
    keyPoints: [
      "When ranges contract, energy builds — like a coiling spring.",
      "Squeezes don't tell you direction, only that a big move is loading.",
      "Breakouts from a squeeze usually resolve in the prevailing trend.",
    ],
    quiz: {
      question: "A multi-day volatility squeeze most reliably tells you…",
      options: ["Which way price will break", "That a large move is coming", "That the trend has ended", "To exit all positions"],
      answer: 1,
      explanation: "A squeeze signals magnitude, not direction. You trade the break, using the prior trend as your directional lean.",
    },
  },
  "risk-reward": {
    keyPoints: [
      "R:R compares potential reward to the amount risked (your stop distance).",
      "With 3:1 reward-to-risk, you can be wrong 60% of the time and still profit.",
      "Position sizing — not prediction — is what keeps you in the game.",
    ],
    quiz: {
      question: "At 3:1 reward-to-risk, roughly what win rate do you need to break even?",
      options: ["~75%", "~50%", "~25%", "~90%"],
      answer: 2,
      explanation: "At 3:1, breakeven is about 25%. Asymmetric payoff means you can lose most trades and still come out ahead.",
    },
  },
  "trading-psychology": {
    keyPoints: [
      "Most edge is lost at the exit, where emotion overrides the plan.",
      "Revenge trades and FOMO entries have measurably worse outcomes.",
      "A mechanical exit removes the bias that turns winners into losers.",
    ],
    quiz: {
      question: "Your journal shows trades placed within 30 min of a loss win far less. This is…",
      options: ["Random noise", "A revenge-trading pattern to fix", "Proof you should trade more", "A sign to increase size"],
      answer: 1,
      explanation: "A statistically worse cluster of trades right after losses is the signature of revenge trading — your highest-leverage habit to fix.",
    },
  },
};

export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = lessonById(id);
  return { title: lesson ? lesson.title : "Lesson" };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = lessonById(id);
  if (!lesson) notFound();

  const track = tracks.find((t) => t.id === lesson.trackId);
  const c = content[id];
  const relatedSignals = signals.filter((s) =>
    s.reasoning.some((step) => step.concept === id)
  );
  const idx = lessons.findIndex((l) => l.id === id);
  const next = lessons[idx + 1];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--ss-text-muted)] transition-colors hover:text-[var(--ss-text)]"
      >
        <ArrowRight size={13} className="rotate-180" /> Learn
      </Link>

      {/* header */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          {track && <Badge tone="violet">{track.name}</Badge>}
          <span className="ss-chip !py-0.5 !text-[10px]">{lesson.level}</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--ss-text-faint)]">
            <Clock size={12} /> {lesson.minutes} min · +{lesson.xp} XP
          </span>
        </div>
        <h1 className="font-display mt-3 text-[2rem] font-semibold leading-tight tracking-tight">
          {lesson.title}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--ss-text-muted)]">{lesson.blurb}</p>
      </header>

      {/* definition */}
      <div className="ss-card p-5">
        <div className="flex items-center gap-2">
          <BookOpen size={15} className="text-[var(--ss-violet)]" />
          <p className="ss-eyebrow !text-[9.5px] !text-[var(--ss-violet)]">The idea</p>
        </div>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-[var(--ss-text)]">{lesson.definition}</p>
      </div>

      {/* key points */}
      {c && (
        <section>
          <h2 className="font-display mb-3 text-[15px] font-semibold tracking-tight">What to remember</h2>
          <ul className="space-y-2.5">
            {c.keyPoints.map((p) => (
              <li key={p} className="flex gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-[var(--ss-accent)]" />
                <span className="text-[13.5px] leading-relaxed text-[var(--ss-text-muted)]">{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* seen in the wild */}
      {relatedSignals.length > 0 && (
        <section className="ss-card overflow-hidden">
          <header className="flex items-center gap-2 border-b border-[var(--ss-border)] px-5 py-3.5">
            <Pulse size={15} className="text-[var(--ss-accent)]" />
            <h2 className="font-display text-[14px] font-semibold tracking-tight">Seen in live signals</h2>
            <span className="ml-auto font-mono text-[10.5px] text-[var(--ss-text-faint)]">
              this concept, right now
            </span>
          </header>
          <ul>
            {relatedSignals.map((s, i) => (
              <li key={s.id} className={i < relatedSignals.length - 1 ? "border-b border-[var(--ss-border)]" : ""}>
                <Link
                  href={`/signals/${s.id}`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--ss-surface)]"
                >
                  <span className="font-display text-[13px] font-semibold">{s.symbol}</span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--ss-text-muted)]">
                    {s.thesis}
                  </span>
                  <ArrowRight size={14} className="shrink-0 text-[var(--ss-text-faint)]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* quiz */}
      {c && <QuizCard {...c.quiz} />}

      {/* complete + next */}
      <div className="space-y-3">
        <MarkComplete xp={lesson.xp} />
        {next && next.status !== "locked" && (
          <Link
            href={`/learn/${next.id}`}
            className="ss-card flex items-center justify-between p-4 transition-colors hover:!bg-[var(--ss-surface-hover)]"
          >
            <div>
              <p className="ss-eyebrow !text-[9px]">Up next</p>
              <p className="mt-0.5 text-[13.5px] font-semibold">{next.title}</p>
            </div>
            <ArrowRight size={16} className="text-[var(--ss-text-faint)]" />
          </Link>
        )}
      </div>
    </div>
  );
}
