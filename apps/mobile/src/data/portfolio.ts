import { genSeries } from './market';

export type TradeStatus = 'open' | 'win' | 'loss' | 'breakeven';
export type TradeDirection = 'long' | 'short';

export interface Trade {
  id: string;
  symbol: string;
  market: 'crypto' | 'stocks' | 'fx';
  direction: TradeDirection;
  status: TradeStatus;
  entry: number;
  exit?: number;
  size: number;
  notional: number;
  pnl?: number;
  pnlPct?: number;
  rMultiple?: number;
  openedAt: string;
  closedAt?: string;
  setup: string;
  emotion: string;
  adherence: number; // 0–100
  notes: string;
}

export const seedTrades: Trade[] = [
  {
    id: 't-001',
    symbol: 'BTC/USDT',
    market: 'crypto',
    direction: 'long',
    status: 'win',
    entry: 61200,
    exit: 66540,
    size: 0.12,
    notional: 7344,
    pnl: 640.8,
    pnlPct: 8.7,
    rMultiple: 2.9,
    openedAt: '2026-06-18',
    closedAt: '2026-06-24',
    setup: 'S/R flip',
    emotion: 'Patient',
    adherence: 95,
    notes: 'Waited for the retest instead of chasing the breakout. Held to target.',
  },
  {
    id: 't-002',
    symbol: 'NVDA',
    market: 'stocks',
    direction: 'long',
    status: 'win',
    entry: 118.4,
    exit: 129.2,
    size: 60,
    notional: 7104,
    pnl: 648,
    pnlPct: 9.1,
    rMultiple: 3.1,
    openedAt: '2026-06-11',
    closedAt: '2026-06-27',
    setup: 'Volatility squeeze',
    emotion: 'Confident',
    adherence: 90,
    notes: 'Scaled out half at 1R, trailed the rest under the 21-EMA.',
  },
  {
    id: 't-003',
    symbol: 'ETH/USDT',
    market: 'crypto',
    direction: 'short',
    status: 'loss',
    entry: 3980,
    exit: 4060,
    size: 1.5,
    notional: 5970,
    pnl: -120,
    pnlPct: -2.0,
    rMultiple: -1,
    openedAt: '2026-06-29',
    closedAt: '2026-06-30',
    setup: 'Supply rejection',
    emotion: 'FOMO',
    adherence: 55,
    notes: 'Entered before the confirmation candle. Stop did its job. Note: stop jumping the gun.',
  },
  {
    id: 't-004',
    symbol: 'SOL/USDT',
    market: 'crypto',
    direction: 'long',
    status: 'win',
    entry: 131.2,
    exit: 142.8,
    size: 40,
    notional: 5248,
    pnl: 464,
    pnlPct: 8.8,
    rMultiple: 2.4,
    openedAt: '2026-06-20',
    closedAt: '2026-06-26',
    setup: 'Breakout retest',
    emotion: 'Patient',
    adherence: 88,
    notes: 'Clean base breakout on 2x volume. Held through one shakeout.',
  },
  {
    id: 't-005',
    symbol: 'TSLA',
    market: 'stocks',
    direction: 'short',
    status: 'loss',
    entry: 238.2,
    exit: 246.1,
    size: 30,
    notional: 7146,
    pnl: -237,
    pnlPct: -3.3,
    rMultiple: -1,
    openedAt: '2026-06-22',
    closedAt: '2026-06-24',
    setup: 'S/R break',
    emotion: 'Revenge',
    adherence: 40,
    notes: 'Chased a breakdown right after a loss. Reclaimed the level and trapped me.',
  },
  {
    id: 't-006',
    symbol: 'AAPL',
    market: 'stocks',
    direction: 'long',
    status: 'win',
    entry: 205.4,
    exit: 213.9,
    size: 35,
    notional: 7189,
    pnl: 297.5,
    pnlPct: 4.1,
    rMultiple: 2.7,
    openedAt: '2026-06-14',
    closedAt: '2026-06-25',
    setup: 'Gap fill',
    emotion: 'Confident',
    adherence: 92,
    notes: 'Gap fill met the 100-EMA. Two supports on one level.',
  },
  {
    id: 't-008',
    symbol: 'BTC/USDT',
    market: 'crypto',
    direction: 'long',
    status: 'open',
    entry: 66800,
    size: 0.1,
    notional: 6680,
    pnlPct: 2.4,
    rMultiple: 1.4,
    openedAt: '2026-07-03',
    setup: 'Higher-low continuation',
    emotion: 'Patient',
    adherence: 90,
    notes: 'Holding for 71k target. Stop under 65.5k.',
  },
];

export interface Position {
  symbol: string;
  direction: TradeDirection;
  size: number;
  value: number;
  pnl: number;
  pnlPct: number;
  weight: number;
}

export const positions: Position[] = [
  { symbol: 'BTC/USDT', direction: 'long', size: 0.1, value: 6841, pnl: 161, pnlPct: 2.4, weight: 27 },
  { symbol: 'NVDA', direction: 'long', size: 45, value: 5801, pnl: 351, pnlPct: 6.4, weight: 23 },
  { symbol: 'SOL/USDT', direction: 'long', size: 26, value: 3715, pnl: 247, pnlPct: 7.1, weight: 15 },
  { symbol: 'AAPL', direction: 'long', size: 18, value: 3839, pnl: 95, pnlPct: 2.5, weight: 15 },
  { symbol: 'XAU/USD', direction: 'long', size: 1.4, value: 3378, pnl: 46, pnlPct: 1.4, weight: 13 },
  { symbol: 'USDC (cash)', direction: 'long', size: 1750, value: 1750, pnl: 0, pnlPct: 0, weight: 7 },
];

export const exposure = [
  { label: 'Crypto', pct: 49, tone: '#2EE6C9' },
  { label: 'Stocks', pct: 38, tone: '#7C5CFF' },
  { label: 'Forex / metals', pct: 13, tone: '#FBBF24' },
];

export const equityCurve = genSeries(21, 90, { base: 21200, drift: 0.0022, vol: 0.011 });
export const benchmarkCurve = genSeries(9, 90, { base: 21200, drift: 0.0009, vol: 0.007 });

export const monthlyReturns = [
  { month: 'Jan', pct: 3.1 },
  { month: 'Feb', pct: -1.8 },
  { month: 'Mar', pct: 5.4 },
  { month: 'Apr', pct: 2.2 },
  { month: 'May', pct: -0.9 },
  { month: 'Jun', pct: 6.8 },
];

export const portfolioStats = {
  totalValue: 25324,
  dayChangePct: 1.3,
  totalReturnPct: 18.4,
  benchmarkReturnPct: 6.1,
  winRate: 58,
  profitFactor: 2.1,
  expectancy: 142,
  avgWin: 462,
  avgLoss: 191,
  maxDrawdown: -7.2,
  sharpe: 1.74,
  totalTrades: 96,
};

export const coachInsights = [
  {
    tone: 'loss' as const,
    title: "You're cutting winners early",
    body: 'Your average winner runs 2.9× shorter than it could. On 6 of your last 10 wins you exited before your first target.',
    metric: '−$1,180 left on the table',
  },
  {
    tone: 'warn' as const,
    title: 'Revenge trades cost you',
    body: 'Trades placed within 30 min of a loss win 22% vs your 58% baseline. Two of your worst trades this month were revenge entries.',
    metric: 'Adherence dropped to 40%',
  },
  {
    tone: 'mint' as const,
    title: 'Your best edge: retests',
    body: '"S/R flip" and "Breakout retest" setups win 71% of the time for you — well above average. Do more of these.',
    metric: '+2.7R average',
  },
];

export const setups = [
  'S/R flip',
  'Breakout retest',
  'Volatility squeeze',
  'Supply rejection',
  'Gap fill',
  'Range reversal',
  'Higher-low continuation',
  'Other',
];

export const emotions = ['Patient', 'Confident', 'Neutral', 'FOMO', 'Revenge', 'Anxious', 'Bored'];

/** Deterministic mock AI trade review. */
export function aiReview(t: Trade): string {
  if (t.status === 'open') {
    return `Position still open. You logged this as "${t.setup}" with ${t.adherence}% adherence — stay mechanical and let the thesis play out. Don't move your stop on hope.`;
  }
  if (t.emotion === 'Revenge' || t.emotion === 'FOMO') {
    return `Flagged "${t.emotion}" with only ${t.adherence}% adherence. The setup may be valid, but the entry wasn't earned — you acted on emotion, not your plan. Your highest-leverage habit to fix.`;
  }
  if ((t.pnlPct ?? 0) < 0 && t.adherence >= 75) {
    return `A losing trade that followed the plan (${t.adherence}% adherence) is a good trade. The thesis didn't play out and your stop capped it at ${t.rMultiple ?? -1}R. Repeat the process.`;
  }
  return `Clean execution: "${t.setup}", ${t.adherence}% adherence, closed for ${t.rMultiple ?? '+'}R. This is your edge — do more of exactly this.`;
}
