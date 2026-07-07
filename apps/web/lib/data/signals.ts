import { type Candle, genCandles } from "./market";

export type Market = "crypto" | "stocks" | "fx";
export type Direction = "long" | "short";
export type SignalStatus = "active" | "watching" | "closed-win" | "closed-loss";
export type Timeframe = "15m" | "1H" | "4H" | "1D";

/** One step of the plain-English reasoning chain. `concept` links into the education layer. */
export interface ReasoningStep {
  text: string;
  concept?: string; // concept id from lib/data/lessons.ts
}

export interface Signal {
  id: string;
  symbol: string;
  name: string;
  market: Market;
  direction: Direction;
  status: SignalStatus;
  confidence: number; // 0–100
  timeframe: Timeframe;
  generatedAt: string;
  thesis: string; // one-sentence plain-English summary
  reasoning: ReasoningStep[];
  indicators: string[];
  entry: number;
  target: number;
  stop: number;
  /** candles + where on the chart the signal fired */
  candles: Candle[];
  signalIndex: number;
  resultPct?: number; // for closed signals
}

export const signals: Signal[] = [
  {
    id: "sig-btc-01",
    symbol: "BTC/USDT",
    name: "Bitcoin",
    market: "crypto",
    direction: "long",
    status: "active",
    confidence: 84,
    timeframe: "4H",
    generatedAt: "12 min ago",
    thesis:
      "Bitcoin is holding a higher low while momentum quietly turns up — a classic bullish divergence at a level buyers have defended twice before.",
    reasoning: [
      {
        text: "Price retested the 66,800 support zone for the third time and printed a higher low — sellers are losing steam.",
        concept: "support-resistance",
      },
      {
        text: "RSI (14) made a higher low while price made a lower low: bullish divergence, which historically precedes reversal on this pair 63% of the time.",
        concept: "rsi-divergence",
      },
      {
        text: "The 50-period EMA is flattening after a downtrend — trend exhaustion rather than continuation.",
        concept: "ema",
      },
      {
        text: "Funding rates reset to neutral, so a squeeze of late shorts adds fuel above 68,900.",
      },
    ],
    indicators: ["RSI 14", "EMA 50/200", "Funding", "Volume profile"],
    entry: 68150,
    target: 71400,
    stop: 66550,
    candles: genCandles(41, 56, { base: 66400, drift: 0.0012, vol: 0.009 }),
    signalIndex: 44,
  },
  {
    id: "sig-nvda-01",
    symbol: "NVDA",
    name: "NVIDIA",
    market: "stocks",
    direction: "long",
    status: "active",
    confidence: 76,
    timeframe: "1D",
    generatedAt: "1h ago",
    thesis:
      "NVDA is coiling in a tightening range under all-time highs while volume dries up — pressure is building for a breakout continuation.",
    reasoning: [
      {
        text: "Ten sessions of contracting range (a 'volatility squeeze') right below resistance — breakouts from these coils resolve in the trend direction ~68% of the time.",
        concept: "volatility-squeeze",
      },
      {
        text: "Declining volume on the consolidation says holders aren't selling; supply is thin above 130.",
        concept: "volume-analysis",
      },
      {
        text: "Price is riding the 21-EMA with every dip bought within a day — trend structure intact.",
        concept: "ema",
      },
    ],
    indicators: ["ATR squeeze", "Volume", "EMA 21", "Rel. strength"],
    entry: 129.4,
    target: 138.0,
    stop: 124.9,
    candles: genCandles(77, 56, { base: 118, drift: 0.0016, vol: 0.011 }),
    signalIndex: 47,
  },
  {
    id: "sig-eth-01",
    symbol: "ETH/USDT",
    name: "Ethereum",
    market: "crypto",
    direction: "short",
    status: "active",
    confidence: 68,
    timeframe: "1H",
    generatedAt: "26 min ago",
    thesis:
      "Ethereum rejected the same supply zone for the fourth time with momentum rolling over — a lower-high short against clear invalidation.",
    reasoning: [
      {
        text: "3,920–3,950 has capped every rally this week; the fourth rejection came on the weakest buying volume yet.",
        concept: "support-resistance",
      },
      {
        text: "RSI printed a lower high at 61 while price matched its prior high — bearish divergence on the hourly.",
        concept: "rsi-divergence",
      },
      {
        text: "ETH/BTC ratio is bleeding, so relative strength favors the short side of ETH specifically.",
      },
    ],
    indicators: ["RSI 14", "Supply zone", "ETH/BTC ratio"],
    entry: 3896,
    target: 3712,
    stop: 3968,
    candles: genCandles(23, 56, { base: 3980, drift: -0.0009, vol: 0.008 }),
    signalIndex: 45,
  },
  {
    id: "sig-eurusd-01",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    market: "fx",
    direction: "short",
    status: "watching",
    confidence: 57,
    timeframe: "4H",
    generatedAt: "3h ago",
    thesis:
      "Euro is stalling at the 200-EMA after a weak bounce — watching for a rejection candle before the setup goes live.",
    reasoning: [
      {
        text: "The bounce from 1.0780 lost momentum exactly at the 200-EMA — a level that has rejected price 5 of the last 6 touches.",
        concept: "ema",
      },
      {
        text: "DXY (dollar index) is basing at support, which pressures EUR/USD from the other side of the pair.",
      },
      {
        text: "Setup needs a bearish engulfing close below 1.0830 to confirm — until then this stays on watch.",
        concept: "candlestick-patterns",
      },
    ],
    indicators: ["EMA 200", "DXY", "Engulfing"],
    entry: 1.0825,
    target: 1.0742,
    stop: 1.0871,
    candles: genCandles(59, 56, { base: 1.093, drift: -0.0005, vol: 0.004 }),
    signalIndex: 46,
  },
  {
    id: "sig-sol-01",
    symbol: "SOL/USDT",
    name: "Solana",
    market: "crypto",
    direction: "long",
    status: "closed-win",
    confidence: 81,
    timeframe: "4H",
    generatedAt: "2d ago",
    thesis:
      "Solana broke out of a three-week base on twice the average volume — entered on the retest of the breakout shelf.",
    reasoning: [
      {
        text: "Breakout above 138 came on 2.1× average volume — participation confirms the move.",
        concept: "volume-analysis",
      },
      {
        text: "The retest held the old resistance as new support (a 'flip'), the highest-probability continuation entry.",
        concept: "support-resistance",
      },
    ],
    indicators: ["Volume", "S/R flip", "EMA 21"],
    entry: 138.8,
    target: 148.5,
    stop: 133.9,
    candles: genCandles(31, 56, { base: 131, drift: 0.0019, vol: 0.012 }),
    signalIndex: 40,
    resultPct: 6.9,
  },
  {
    id: "sig-tsla-01",
    symbol: "TSLA",
    name: "Tesla",
    market: "stocks",
    direction: "short",
    status: "closed-loss",
    confidence: 62,
    timeframe: "1D",
    generatedAt: "5d ago",
    thesis:
      "Breakdown short below the 240 shelf invalidated when price reclaimed the level within two sessions — stopped out at −1R, exactly as planned.",
    reasoning: [
      {
        text: "Support at 240 broke on rising volume, but the follow-through never came — the market reclaimed the level and trapped late shorts.",
        concept: "support-resistance",
      },
      {
        text: "The stop above 246 capped the loss at 1R. Losing trades that follow the plan are good trades.",
        concept: "risk-reward",
      },
    ],
    indicators: ["S/R break", "Volume"],
    entry: 238.2,
    target: 221.0,
    stop: 246.1,
    candles: genCandles(97, 56, { base: 252, drift: -0.0003, vol: 0.013 }),
    signalIndex: 38,
    resultPct: -3.3,
  },
  {
    id: "sig-aapl-01",
    symbol: "AAPL",
    name: "Apple",
    market: "stocks",
    direction: "long",
    status: "closed-win",
    confidence: 71,
    timeframe: "1D",
    generatedAt: "1w ago",
    thesis:
      "Gap-fill long at 205 where the March gap met the rising 100-EMA — two supports stacked on one level.",
    reasoning: [
      {
        text: "Unfilled gaps act like magnets, and filled gaps often act as support — 205 was both the gap fill and the 100-EMA.",
        concept: "ema",
      },
      {
        text: "Reward-to-risk at entry was 3.1:1 against the prior high — asymmetric even at a 50% hit rate.",
        concept: "risk-reward",
      },
    ],
    indicators: ["Gap fill", "EMA 100", "R:R 3.1"],
    entry: 205.4,
    target: 214.8,
    stop: 202.3,
    candles: genCandles(13, 56, { base: 199, drift: 0.001, vol: 0.008 }),
    signalIndex: 42,
    resultPct: 4.6,
  },
];

export const heroSignal = signals[0];

export function statusLabel(s: SignalStatus): string {
  switch (s) {
    case "active":
      return "Active";
    case "watching":
      return "Watching";
    case "closed-win":
      return "Closed · Win";
    case "closed-loss":
      return "Closed · Loss";
  }
}

export function rrRatio(s: Signal): string {
  const risk = Math.abs(s.entry - s.stop);
  const reward = Math.abs(s.target - s.entry);
  if (risk === 0) return "—";
  return `${(reward / risk).toFixed(1)}:1`;
}

export function fmtPrice(v: number): string {
  if (v >= 10000) return v.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (v >= 1000) return v.toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (v >= 10) return v.toFixed(2);
  return v.toFixed(4);
}
