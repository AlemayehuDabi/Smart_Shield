/** Deterministic synthetic market data — stable across renders (no Math.random). */

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

export function genCandles(
  seed: number,
  bars: number,
  opts: { base: number; drift?: number; vol?: number } = { base: 100 },
): Candle[] {
  const rnd = seeded(seed);
  const { base, drift = 0.0004, vol = 0.011 } = opts;
  const out: Candle[] = [];
  let c = base;
  let regime = 1;
  for (let i = 0; i < bars; i++) {
    if (rnd() < 0.06) regime *= -1;
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
  opts: { base: number; drift?: number; vol?: number } = { base: 100 },
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
  { symbol: 'BTC', price: '68,412', changePct: 1.24 },
  { symbol: 'ETH', price: '3,841', changePct: -0.42 },
  { symbol: 'SOL', price: '142.9', changePct: 2.81 },
  { symbol: 'NVDA', price: '128.9', changePct: 0.67 },
  { symbol: 'SPY', price: '552.1', changePct: 0.21 },
  { symbol: 'AAPL', price: '213.3', changePct: -0.35 },
];

export function fmtPrice(v: number): string {
  if (v >= 10000) return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (v >= 1000) return v.toLocaleString('en-US', { maximumFractionDigits: 1 });
  if (v >= 10) return v.toFixed(2);
  return v.toFixed(4);
}

export function fmtUsd(v: number, opts: { sign?: boolean } = {}): string {
  const sign = opts.sign && v > 0 ? '+' : '';
  const neg = v < 0 ? '-' : '';
  const abs = Math.abs(v);
  return `${neg}${sign}$${abs.toLocaleString('en-US', { maximumFractionDigits: abs < 100 ? 2 : 0 })}`;
}
