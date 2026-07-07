export type LessonLevel = 'Foundation' | 'Intermediate' | 'Advanced';
export type LessonStatus = 'done' | 'in-progress' | 'locked' | 'available';

export interface Lesson {
  id: string; // concept id — referenced by signal reasoning steps
  title: string;
  blurb: string;
  minutes: number;
  level: LessonLevel;
  xp: number;
  status: LessonStatus;
  definition: string;
  trackId: string;
  keyPoints: string[];
  quiz: { question: string; options: string[]; answer: number; explanation: string };
}

export interface Track {
  id: string;
  name: string;
  description: string;
  accent: 'mint' | 'ai' | 'warn';
}

export const tracks: Track[] = [
  { id: 'foundations', name: 'Market foundations', description: 'The vocabulary every setup is built from.', accent: 'ai' },
  { id: 'momentum', name: 'Reading momentum', description: 'Spot exhaustion and continuation before price confirms.', accent: 'mint' },
  { id: 'risk', name: 'Risk & psychology', description: 'The math and mindset that keep you in the game.', accent: 'warn' },
];

export const lessons: Lesson[] = [
  {
    id: 'support-resistance',
    title: 'Support & resistance',
    blurb: 'Why price remembers levels — and how to trade the ones that matter.',
    minutes: 6,
    level: 'Foundation',
    xp: 40,
    status: 'done',
    definition:
      'Price levels where buying or selling has repeatedly stepped in. The more times a level holds, the more traders watch it.',
    trackId: 'foundations',
    keyPoints: [
      'Levels form where buyers or sellers repeatedly step in — memory, not magic.',
      'The more times a level is tested, the more traders watch it.',
      'A broken level often flips role: old resistance becomes new support.',
    ],
    quiz: {
      question: 'Price breaks above resistance, pulls back to it, and holds. What is this?',
      options: ['A fakeout', 'A support/resistance flip', 'A divergence', 'A squeeze'],
      answer: 1,
      explanation: 'When old resistance holds as new support on the retest, the level has flipped — a high-probability continuation entry.',
    },
  },
  {
    id: 'candlestick-patterns',
    title: 'Candlestick patterns',
    blurb: 'Engulfings, pins and dojis — what a single bar is telling you.',
    minutes: 8,
    level: 'Foundation',
    xp: 40,
    status: 'done',
    definition:
      'The shape of a candle encodes the fight between buyers and sellers within that period. Certain shapes reliably precede reversals.',
    trackId: 'foundations',
    keyPoints: [
      'A candle encodes the battle between buyers and sellers in one period.',
      'Long wicks show rejection; a small body shows indecision.',
      'Patterns matter most at key levels, not in no-man’s-land.',
    ],
    quiz: {
      question: 'A bullish engulfing candle is most meaningful when it appears…',
      options: ['Mid-range', 'At a tested support level', 'After three green candles', 'On low volume'],
      answer: 1,
      explanation: 'Context is everything — the same pattern at a defended support carries far more weight.',
    },
  },
  {
    id: 'ema',
    title: 'Moving averages (EMA)',
    blurb: 'Dynamic support, trend direction, and the 21/50/200 stack.',
    minutes: 7,
    level: 'Foundation',
    xp: 40,
    status: 'done',
    definition:
      'An exponential moving average tracks the trend by weighting recent prices more heavily. Price riding an EMA signals an intact trend.',
    trackId: 'foundations',
    keyPoints: [
      'An EMA weights recent prices more heavily, so it reacts faster.',
      'Price riding an EMA signals an intact trend; reclaims show demand.',
      'The 50/200 relationship frames the bigger regime.',
    ],
    quiz: {
      question: 'Price keeps dipping to the 21-EMA and bouncing. This suggests…',
      options: ['The trend is broken', 'Buyers are defending the trend', 'A reversal is imminent', 'Volume is drying up'],
      answer: 1,
      explanation: 'Dips being bought at a rising EMA is textbook trend continuation.',
    },
  },
  {
    id: 'volume-analysis',
    title: 'Volume analysis',
    blurb: 'Confirmation, absorption, and why thin breakouts fail.',
    minutes: 9,
    level: 'Intermediate',
    xp: 60,
    status: 'in-progress',
    definition:
      'Volume measures participation. A move on rising volume has conviction; the same move on falling volume is suspect.',
    trackId: 'momentum',
    keyPoints: [
      'Volume is participation — it shows whether a move has conviction.',
      'Breakouts on rising volume are trustworthy; thin ones often fail.',
      'Declining volume in a base means holders aren’t selling.',
    ],
    quiz: {
      question: 'A breakout occurs on volume well below average. You should…',
      options: ['Buy aggressively', 'Be skeptical — it may fail', 'Ignore volume', 'Short it'],
      answer: 1,
      explanation: 'Thin breakouts lack participation and frequently reverse.',
    },
  },
  {
    id: 'rsi-divergence',
    title: 'RSI divergence',
    blurb: 'When momentum and price disagree — and momentum usually wins.',
    minutes: 10,
    level: 'Intermediate',
    xp: 60,
    status: 'available',
    definition:
      'When price makes a new high/low but RSI does not, momentum is fading. Divergence often precedes a reversal.',
    trackId: 'momentum',
    keyPoints: [
      'RSI measures the speed and size of recent moves (momentum).',
      'Bullish divergence: price lower low, RSI higher low — sellers exhaust.',
      'Divergence is a warning, not a trigger — wait for price to confirm.',
    ],
    quiz: {
      question: 'Price prints a new high but RSI makes a lower high. This is…',
      options: ['Bullish divergence', 'Bearish divergence', 'A squeeze', 'Confirmation'],
      answer: 1,
      explanation: 'Price up while momentum fades is bearish divergence — buyers running out of steam.',
    },
  },
  {
    id: 'volatility-squeeze',
    title: 'Volatility squeeze',
    blurb: 'How coiling ranges store energy — and which way they release it.',
    minutes: 8,
    level: 'Intermediate',
    xp: 60,
    status: 'available',
    definition:
      'When volatility contracts into a tight range, energy builds. Breakouts from squeezes tend to resolve in the prevailing trend.',
    trackId: 'momentum',
    keyPoints: [
      'When ranges contract, energy builds — like a coiling spring.',
      'Squeezes tell you magnitude, not direction.',
      'Breakouts usually resolve in the prevailing trend.',
    ],
    quiz: {
      question: 'A multi-day volatility squeeze most reliably tells you…',
      options: ['Which way price breaks', 'That a large move is coming', 'The trend has ended', 'To exit everything'],
      answer: 1,
      explanation: 'A squeeze signals magnitude — you trade the break using the prior trend as your lean.',
    },
  },
  {
    id: 'risk-reward',
    title: 'Risk : reward & sizing',
    blurb: 'Why a 45% win rate can still print money.',
    minutes: 11,
    level: 'Intermediate',
    xp: 70,
    status: 'locked',
    definition:
      'Reward-to-risk compares potential profit to the amount risked. Asymmetric R:R lets you be wrong often and still profit.',
    trackId: 'risk',
    keyPoints: [
      'R:R compares potential reward to the amount risked (your stop).',
      'At 3:1 you can be wrong 60% of the time and still profit.',
      'Position sizing, not prediction, keeps you in the game.',
    ],
    quiz: {
      question: 'At 3:1 reward-to-risk, roughly what win rate do you need to break even?',
      options: ['~75%', '~50%', '~25%', '~90%'],
      answer: 2,
      explanation: 'At 3:1, breakeven is about 25% — asymmetric payoff means you can lose most trades and still win.',
    },
  },
  {
    id: 'trading-psychology',
    title: 'The discipline of the exit',
    blurb: 'Cutting losers, letting winners run, and beating your own brain.',
    minutes: 12,
    level: 'Advanced',
    xp: 80,
    status: 'locked',
    definition:
      'Most edge is lost at the exit. Systematic exits remove the emotional bias that turns winners into losers.',
    trackId: 'risk',
    keyPoints: [
      'Most edge is lost at the exit, where emotion overrides the plan.',
      'Revenge and FOMO entries have measurably worse outcomes.',
      'A mechanical exit removes the bias that turns winners into losers.',
    ],
    quiz: {
      question: 'Trades placed within 30 min of a loss win far less often. This is…',
      options: ['Random noise', 'A revenge-trading pattern to fix', 'A reason to trade more', 'A sign to size up'],
      answer: 1,
      explanation: 'A worse cluster right after losses is the signature of revenge trading — the top habit to fix.',
    },
  },
];

export function lessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function conceptLabel(id: string): string {
  return lessonById(id)?.title ?? id;
}

export const learnProgress = {
  lessonsDone: lessons.filter((l) => l.status === 'done').length,
  lessonsTotal: lessons.length,
  xp: 1240,
  xpToNext: 1600,
  streakDays: 12,
  rank: 'Apprentice',
};
