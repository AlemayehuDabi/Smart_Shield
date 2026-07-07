export type LessonLevel = "Foundation" | "Intermediate" | "Advanced";
export type LessonStatus = "done" | "in-progress" | "locked" | "available";

export interface Lesson {
  /** concept id — referenced by signal reasoning steps */
  id: string;
  title: string;
  blurb: string;
  minutes: number;
  level: LessonLevel;
  xp: number;
  status: LessonStatus;
  /** one-line definition used in in-context tooltips */
  definition: string;
  trackId: string;
}

export interface Track {
  id: string;
  name: string;
  description: string;
  accent: "accent" | "violet" | "gold";
}

export const tracks: Track[] = [
  {
    id: "foundations",
    name: "Market foundations",
    description: "The vocabulary every setup is built from.",
    accent: "violet",
  },
  {
    id: "momentum",
    name: "Reading momentum",
    description: "Spot exhaustion and continuation before price confirms.",
    accent: "accent",
  },
  {
    id: "risk",
    name: "Risk & psychology",
    description: "The math and the mindset that keep you in the game.",
    accent: "gold",
  },
];

export const lessons: Lesson[] = [
  {
    id: "support-resistance",
    title: "Support & resistance",
    blurb: "Why price remembers levels — and how to trade the ones that matter.",
    minutes: 6,
    level: "Foundation",
    xp: 40,
    status: "done",
    definition:
      "Price levels where buying or selling has repeatedly stepped in. The more times a level holds, the more traders watch it.",
    trackId: "foundations",
  },
  {
    id: "candlestick-patterns",
    title: "Candlestick patterns",
    blurb: "Engulfings, pins and dojis — what a single bar is telling you.",
    minutes: 8,
    level: "Foundation",
    xp: 40,
    status: "done",
    definition:
      "The shape of a candle encodes the fight between buyers and sellers within that period. Certain shapes reliably precede reversals.",
    trackId: "foundations",
  },
  {
    id: "ema",
    title: "Moving averages (EMA)",
    blurb: "Dynamic support, trend direction, and the 21/50/200 stack.",
    minutes: 7,
    level: "Foundation",
    xp: 40,
    status: "done",
    definition:
      "An exponential moving average tracks the trend by weighting recent prices more heavily. Price riding an EMA signals an intact trend.",
    trackId: "foundations",
  },
  {
    id: "volume-analysis",
    title: "Volume analysis",
    blurb: "Confirmation, absorption, and why thin breakouts fail.",
    minutes: 9,
    level: "Intermediate",
    xp: 60,
    status: "in-progress",
    definition:
      "Volume measures participation. A move on rising volume has conviction; the same move on falling volume is suspect.",
    trackId: "momentum",
  },
  {
    id: "rsi-divergence",
    title: "RSI divergence",
    blurb: "When momentum and price disagree — and momentum usually wins.",
    minutes: 10,
    level: "Intermediate",
    xp: 60,
    status: "available",
    definition:
      "When price makes a new high/low but RSI does not, momentum is fading. Divergence often precedes a reversal.",
    trackId: "momentum",
  },
  {
    id: "volatility-squeeze",
    title: "Volatility squeeze",
    blurb: "How coiling ranges store energy — and which way they release it.",
    minutes: 8,
    level: "Intermediate",
    xp: 60,
    status: "available",
    definition:
      "When volatility contracts into a tight range, energy builds. Breakouts from squeezes tend to resolve in the prevailing trend.",
    trackId: "momentum",
  },
  {
    id: "risk-reward",
    title: "Risk : reward & position sizing",
    blurb: "Why a 45% win rate can still print money.",
    minutes: 11,
    level: "Intermediate",
    xp: 70,
    status: "locked",
    definition:
      "Reward-to-risk compares potential profit to the amount risked. Asymmetric R:R lets you be wrong often and still profit.",
    trackId: "risk",
  },
  {
    id: "trading-psychology",
    title: "The discipline of the exit",
    blurb: "Cutting losers, letting winners run, and beating your own brain.",
    minutes: 12,
    level: "Advanced",
    xp: 80,
    status: "locked",
    definition:
      "Most edge is lost at the exit. Systematic exits remove the emotional bias that turns winners into losers.",
    trackId: "risk",
  },
];

export const lessonById = (id: string): Lesson | undefined =>
  lessons.find((l) => l.id === id);

/** Short human label for a concept id (used by signal reasoning links). */
export function conceptLabel(id: string): string {
  return lessonById(id)?.title ?? id;
}

export const learnProgress = {
  lessonsDone: lessons.filter((l) => l.status === "done").length,
  lessonsTotal: lessons.length,
  xp: 1240,
  xpToNext: 1600,
  streakDays: 12,
  rank: "Apprentice",
};
