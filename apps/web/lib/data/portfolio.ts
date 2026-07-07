import { genSeries } from "./market";

export type TradeStatus = "open" | "win" | "loss" | "breakeven";
export type TradeDirection = "long" | "short";

export interface Trade {
  id: string;
  symbol: string;
  market: "crypto" | "stocks" | "fx";
  direction: TradeDirection;
  status: TradeStatus;
  entry: number;
  exit?: number;
  size: number; // units
  notional: number; // $ exposure at entry
  pnl?: number; // realized $ (undefined while open)
  pnlPct?: number;
  rMultiple?: number; // realized R (or open R)
  openedAt: string; // ISO date
  closedAt?: string;
  setup: string; // strategy / setup tag
  emotion: string; // psychology tag
  adherence: number; // 0–100 plan adherence
  notes: string;
}

export const trades: Trade[] = [
  {
    id: "t-001",
    symbol: "BTC/USDT",
    market: "crypto",
    direction: "long",
    status: "win",
    entry: 61200,
    exit: 66540,
    size: 0.12,
    notional: 7344,
    pnl: 640.8,
    pnlPct: 8.7,
    rMultiple: 2.9,
    openedAt: "2026-06-18",
    closedAt: "2026-06-24",
    setup: "S/R flip",
    emotion: "Patient",
    adherence: 95,
    notes: "Waited for the retest instead of chasing the breakout. Textbook entry, held to target.",
  },
  {
    id: "t-002",
    symbol: "NVDA",
    market: "stocks",
    direction: "long",
    status: "win",
    entry: 118.4,
    exit: 129.2,
    size: 60,
    notional: 7104,
    pnl: 648,
    pnlPct: 9.1,
    rMultiple: 3.1,
    openedAt: "2026-06-11",
    closedAt: "2026-06-27",
    setup: "Volatility squeeze",
    emotion: "Confident",
    adherence: 90,
    notes: "Scaled out half at 1R, trailed the rest under the 21-EMA.",
  },
  {
    id: "t-003",
    symbol: "ETH/USDT",
    market: "crypto",
    direction: "short",
    status: "loss",
    entry: 3980,
    exit: 4060,
    size: 1.5,
    notional: 5970,
    pnl: -120,
    pnlPct: -2.0,
    rMultiple: -1,
    openedAt: "2026-06-29",
    closedAt: "2026-06-30",
    setup: "Supply rejection",
    emotion: "FOMO",
    adherence: 55,
    notes: "Entered before the confirmation candle. Stop did its job. Note: stop jumping the gun.",
  },
  {
    id: "t-004",
    symbol: "SOL/USDT",
    market: "crypto",
    direction: "long",
    status: "win",
    entry: 131.2,
    exit: 142.8,
    size: 40,
    notional: 5248,
    pnl: 464,
    pnlPct: 8.8,
    rMultiple: 2.4,
    openedAt: "2026-06-20",
    closedAt: "2026-06-26",
    setup: "Breakout retest",
    emotion: "Patient",
    adherence: 88,
    notes: "Clean base breakout on 2x volume. Held through one shakeout.",
  },
  {
    id: "t-005",
    symbol: "TSLA",
    market: "stocks",
    direction: "short",
    status: "loss",
    entry: 238.2,
    exit: 246.1,
    size: 30,
    notional: 7146,
    pnl: -237,
    pnlPct: -3.3,
    rMultiple: -1,
    openedAt: "2026-06-22",
    closedAt: "2026-06-24",
    setup: "S/R break",
    emotion: "Revenge",
    adherence: 40,
    notes: "Chased a breakdown right after a loss. Reclaimed the level and trapped me. Classic revenge trade.",
  },
  {
    id: "t-006",
    symbol: "AAPL",
    market: "stocks",
    direction: "long",
    status: "win",
    entry: 205.4,
    exit: 213.9,
    size: 35,
    notional: 7189,
    pnl: 297.5,
    pnlPct: 4.1,
    rMultiple: 2.7,
    openedAt: "2026-06-14",
    closedAt: "2026-06-25",
    setup: "Gap fill",
    emotion: "Confident",
    adherence: 92,
    notes: "Gap fill met the 100-EMA. Two supports on one level.",
  },
  {
    id: "t-007",
    symbol: "EUR/USD",
    market: "fx",
    direction: "long",
    status: "breakeven",
    entry: 1.0782,
    exit: 1.0786,
    size: 50000,
    notional: 53910,
    pnl: 20,
    pnlPct: 0.0,
    rMultiple: 0.1,
    openedAt: "2026-06-28",
    closedAt: "2026-06-30",
    setup: "Range reversal",
    emotion: "Neutral",
    adherence: 78,
    notes: "Moved stop to breakeven after 1R stalled. Fine — protected capital.",
  },
  {
    id: "t-008",
    symbol: "BTC/USDT",
    market: "crypto",
    direction: "long",
    status: "open",
    entry: 66800,
    size: 0.1,
    notional: 6680,
    pnlPct: 2.4,
    rMultiple: 1.4,
    openedAt: "2026-07-03",
    setup: "Higher-low continuation",
    emotion: "Patient",
    adherence: 90,
    notes: "Holding for 71k target. Stop under 65.5k.",
  },
];

export interface Position {
  symbol: string;
  market: "crypto" | "stocks" | "fx";
  direction: TradeDirection;
  size: number;
  entry: number;
  price: number;
  value: number;
  pnl: number;
  pnlPct: number;
  weight: number; // % of book
}

export const positions: Position[] = [
  { symbol: "BTC/USDT", market: "crypto", direction: "long", size: 0.1, entry: 66800, price: 68412, value: 6841, pnl: 161, pnlPct: 2.4, weight: 27 },
  { symbol: "NVDA", market: "stocks", direction: "long", size: 45, entry: 121.1, price: 128.9, value: 5801, pnl: 351, pnlPct: 6.4, weight: 23 },
  { symbol: "SOL/USDT", market: "crypto", direction: "long", size: 26, entry: 133.4, price: 142.9, value: 3715, pnl: 247, pnlPct: 7.1, weight: 15 },
  { symbol: "AAPL", market: "stocks", direction: "long", size: 18, entry: 208.0, price: 213.3, value: 3839, pnl: 95, pnlPct: 2.5, weight: 15 },
  { symbol: "XAU/USD", market: "fx", direction: "long", size: 1.4, entry: 2380, price: 2412.7, value: 3378, pnl: 46, pnlPct: 1.4, weight: 13 },
  { symbol: "USDC (cash)", market: "crypto", direction: "long", size: 1750, entry: 1, price: 1, value: 1750, pnl: 0, pnlPct: 0, weight: 7 },
];

/** exposure by market, for the allocation bars */
export const exposure = [
  { label: "Crypto", pct: 49, tone: "var(--ss-chart-1)" },
  { label: "Stocks", pct: 38, tone: "var(--ss-chart-2)" },
  { label: "Forex / metals", pct: 13, tone: "var(--ss-chart-3)" },
];

export const equityCurve = genSeries(21, 90, { base: 21200, drift: 0.0022, vol: 0.011 });
export const benchmarkCurve = genSeries(9, 90, { base: 21200, drift: 0.0009, vol: 0.007 });

/** monthly return % for the bar chart */
export const monthlyReturns = [
  { month: "Jan", pct: 3.1 },
  { month: "Feb", pct: -1.8 },
  { month: "Mar", pct: 5.4 },
  { month: "Apr", pct: 2.2 },
  { month: "May", pct: -0.9 },
  { month: "Jun", pct: 6.8 },
];

export const portfolioStats = {
  totalValue: 25324,
  dayChangePct: 1.3,
  dayChange: 324,
  totalReturnPct: 18.4,
  benchmarkReturnPct: 6.1,
  winRate: 58,
  profitFactor: 2.1,
  expectancy: 142, // $ per trade
  avgWin: 462,
  avgLoss: 191,
  maxDrawdown: -7.2,
  sharpe: 1.74,
  totalTrades: 96,
};

/** behavioral coach insights derived from the journal */
export const coachInsights = [
  {
    tone: "loss" as const,
    title: "You're cutting winners early",
    body: "Your average winner runs 2.9× shorter than it could. On 6 of your last 10 wins you exited before your first target.",
    metric: "-$1,180 left on the table",
  },
  {
    tone: "warn" as const,
    title: "Revenge trades cost you",
    body: "Trades placed within 30 min of a loss have a 22% win rate vs your 58% baseline. Two of your worst trades this month were revenge entries.",
    metric: "Plan adherence dropped to 40%",
  },
  {
    tone: "accent" as const,
    title: "Your best edge: retests",
    body: "\"S/R flip\" and \"Breakout retest\" setups win 71% of the time for you — well above your average. Do more of these.",
    metric: "+2.7R average",
  },
];

export const setups = [
  "S/R flip",
  "Breakout retest",
  "Volatility squeeze",
  "Supply rejection",
  "Gap fill",
  "Range reversal",
  "Higher-low continuation",
  "Other",
];

export const emotions = ["Patient", "Confident", "Neutral", "FOMO", "Revenge", "Anxious", "Bored"];

export function fmtUsd(v: number, opts: { sign?: boolean } = {}): string {
  const sign = opts.sign && v > 0 ? "+" : "";
  const neg = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  return `${neg}${sign}$${abs.toLocaleString("en-US", { maximumFractionDigits: abs < 100 ? 2 : 0 })}`;
}
