import { genSeries } from './market';

export type StrategyStatus = 'live' | 'paused' | 'locked';

export interface Rule {
  kind: 'IF' | 'AND' | 'THEN';
  text: string;
  tone?: 'profit' | 'loss' | 'neutral';
}

export interface Strategy {
  id: string;
  name: string;
  symbol: string;
  timeframe: string;
  status: StrategyStatus;
  description: string;
  rules: Rule[];
  guardrails: { maxDrawdown: string; dailyLossCap: string };
  mastery: { done: number; total: number };
  perf: { trades: number; winRate: number; pnlPct: number };
  since: string;
}

export const seedStrategies: Strategy[] = [
  {
    id: 'st-btc-mr',
    name: 'Mean-reversion · BTC',
    symbol: 'BTC/USDT',
    timeframe: '4H',
    status: 'live',
    description: 'Fade oversold flushes back to the mean while the higher-timeframe trend is up.',
    rules: [
      { kind: 'IF', text: 'RSI(14) < 30' },
      { kind: 'AND', text: 'price > EMA(200)' },
      { kind: 'THEN', text: 'LONG · risk 1%', tone: 'profit' },
    ],
    guardrails: { maxDrawdown: '−8%', dailyLossCap: '$250' },
    mastery: { done: 5, total: 5 },
    perf: { trades: 41, winRate: 63, pnlPct: 14.2 },
    since: 'live 12 days',
  },
  {
    id: 'st-nvda-mo',
    name: 'Momentum breakout · NVDA',
    symbol: 'NVDA',
    timeframe: '1D',
    status: 'paused',
    description: 'Buy volatility-squeeze breakouts above resistance with volume confirmation.',
    rules: [
      { kind: 'IF', text: 'range < ATR squeeze' },
      { kind: 'AND', text: 'close > 20d high' },
      { kind: 'THEN', text: 'LONG · risk 0.75%', tone: 'profit' },
    ],
    guardrails: { maxDrawdown: '−6%', dailyLossCap: '$200' },
    mastery: { done: 5, total: 5 },
    perf: { trades: 23, winRate: 57, pnlPct: 8.6 },
    since: 'paused 2 days ago',
  },
  {
    id: 'st-eth-mr',
    name: 'Supply-zone short · ETH',
    symbol: 'ETH/USDT',
    timeframe: '1H',
    status: 'locked',
    description: 'Short repeated rejections at a supply zone with bearish momentum divergence.',
    rules: [
      { kind: 'IF', text: 'price at supply zone' },
      { kind: 'AND', text: 'bearish RSI divergence' },
      { kind: 'THEN', text: 'SHORT · risk 1%', tone: 'loss' },
    ],
    guardrails: { maxDrawdown: '−5%', dailyLossCap: '$150' },
    mastery: { done: 3, total: 5 },
    perf: { trades: 0, winRate: 0, pnlPct: 0 },
    since: 'draft #3',
  },
];

export type ActivityKind = 'entry' | 'exit' | 'blocked' | 'info';

export interface ActivityEvent {
  id: string;
  time: string;
  kind: ActivityKind;
  strategy: string;
  text: string;
  pnl?: string;
}

export const activityFeed: ActivityEvent[] = [
  { id: 'a1', time: '10:41', kind: 'entry', strategy: 'Mean-reversion · BTC', text: 'Opened LONG 0.10 BTC @ 66,980 — RSI 28, price above 200-EMA.' },
  { id: 'a2', time: '09:12', kind: 'info', strategy: 'Mean-reversion · BTC', text: 'Guardrail check passed · exposure within 1% risk cap.' },
  { id: 'a3', time: '08:55', kind: 'blocked', strategy: 'Momentum breakout · NVDA', text: 'Signal skipped — strategy is paused.' },
  { id: 'a4', time: 'Yesterday', kind: 'exit', strategy: 'Mean-reversion · BTC', text: 'Closed LONG @ 68,410 at target.', pnl: '+$143' },
  { id: 'a5', time: 'Yesterday', kind: 'blocked', strategy: 'Mean-reversion · BTC', text: 'Second entry blocked — max concurrent positions reached.' },
  { id: 'a6', time: '2d ago', kind: 'exit', strategy: 'Momentum breakout · NVDA', text: 'Closed LONG @ 129.2 — trailed under 21-EMA.', pnl: '+$210' },
];

export const automationStats = {
  todayPnl: 143,
  openRisk: '1.0%',
};

export const backtestEquity = genSeries(33, 120, { base: 10000, drift: 0.0028, vol: 0.014 });
export const backtestBenchmark = genSeries(5, 120, { base: 10000, drift: 0.001, vol: 0.008 });

export const backtestMetrics = {
  netReturn: 42.7,
  benchmark: 11.2,
  winRate: 63,
  profitFactor: 2.4,
  maxDrawdown: -9.1,
  sharpe: 1.9,
  trades: 41,
  expectancy: 168,
  avgHold: '2.3 days',
  bestTrade: 1240,
  worstTrade: -410,
};

export const backtestMonths = [
  { month: 'Jan', pct: 4.2 },
  { month: 'Feb', pct: 6.1 },
  { month: 'Mar', pct: -2.4 },
  { month: 'Apr', pct: 8.8 },
  { month: 'May', pct: 3.1 },
  { month: 'Jun', pct: 7.4 },
];

export interface Broker {
  id: string;
  name: string;
  glyph: string;
  kind: string;
  popular?: boolean;
}

export const brokers: Broker[] = [
  { id: 'binance', name: 'Binance', glyph: 'B', kind: 'Crypto', popular: true },
  { id: 'coinbase', name: 'Coinbase', glyph: 'C', kind: 'Crypto', popular: true },
  { id: 'kraken', name: 'Kraken', glyph: 'K', kind: 'Crypto' },
  { id: 'alpaca', name: 'Alpaca', glyph: 'A', kind: 'Stocks', popular: true },
  { id: 'ibkr', name: 'IBKR', glyph: 'IB', kind: 'Stocks & FX' },
  { id: 'oanda', name: 'OANDA', glyph: 'O', kind: 'Forex' },
];

export const builderPalette = {
  indicators: ['RSI(14)', 'EMA(20)', 'EMA(50)', 'EMA(200)', 'MACD', 'ATR', 'Volume', 'VWAP'],
  operators: ['<', '>', 'crosses ↑', 'crosses ↓'],
  actions: ['LONG', 'SHORT', 'CLOSE'],
};
