/** Deterministic synthetic market data — stable across SSR/hydration (no Math.random). */

export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

/** Mulberry32-style deterministic PRNG */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate OHLCV candles with a controllable drift/regime so chart shapes
 * look like real tape (trends, pullbacks, vol clusters) instead of noise.
 */
export function genCandles(
  seed: number,
  bars: number,
  opts: { base: number; drift?: number; vol?: number } = { base: 100 }
): Candle[] {
  const rnd = seeded(seed);
  const { base, drift = 0.0004, vol = 0.011 } = opts;
  const out: Candle[] = [];
  let c = base;
  let regime = 1;
  for (let i = 0; i < bars; i++) {
    if (rnd() < 0.06) regime *= -1; // occasional trend flip
    const wave = Math.sin(i * 0.22) * 0.25 + Math.cos(i * 0.07) * 0.35;
    const shock = (rnd() - 0.5) * 2;
    const o = c;
    const ret = drift * regime + vol * (0.55 * shock + 0.45 * wave * (rnd() - 0.5) * 2);
    c = Math.max(o * (1 + ret), 0.0001);
    const wickUp = Math.abs(shock) * vol * o * (0.4 + rnd() * 0.6);
    const wickDn = Math.abs(shock) * vol * o * (0.4 + rnd() * 0.6);
    const h = Math.max(o, c) + wickUp;
    const l = Math.min(o, c) - wickDn;
    const v = 0.4 + rnd() * 0.6 + (Math.abs(ret) / vol) * 0.5;
    out.push({ o, h, l, c, v });
  }
  return out;
}

/** Random-walk line series (equity curves, sparklines). Returns values ≥ 0. */
export function genSeries(
  seed: number,
  points: number,
  opts: { base: number; drift?: number; vol?: number } = { base: 100 }
): number[] {
  const rnd = seeded(seed);
  const { base, drift = 0.002, vol = 0.02 } = opts;
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v = Math.max(v * (1 + drift + (rnd() - 0.48) * vol), 0.0001);
    out.push(v);
  }
  return out;
}

export interface TickerQuote {
  symbol: string;
  price: string;
  changePct: number;
}

export const tickerTape: TickerQuote[] = [
  { symbol: "BTC/USDT", price: "68,412", changePct: 1.24 },
  { symbol: "ETH/USDT", price: "3,841.2", changePct: -0.42 },
  { symbol: "SOL/USDT", price: "142.88", changePct: 2.81 },
  { symbol: "NVDA", price: "128.92", changePct: 0.67 },
  { symbol: "SPY", price: "552.14", changePct: 0.21 },
  { symbol: "AAPL", price: "213.30", changePct: -0.35 },
  { symbol: "EUR/USD", price: "1.0842", changePct: -0.05 },
  { symbol: "TSLA", price: "246.61", changePct: 1.92 },
  { symbol: "XAU/USD", price: "2,412.7", changePct: 0.44 },
  { symbol: "DOGE/USDT", price: "0.1284", changePct: -1.67 },
];
