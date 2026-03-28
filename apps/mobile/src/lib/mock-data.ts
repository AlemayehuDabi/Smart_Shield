/** Smart Shield mobile — domain mocks (swap for API) */

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Metric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: 'neutral' | 'info' | 'warn' | 'danger' | 'profit' | 'loss';
}

export interface TradingSignal {
  id: string;
  title: string;
  severity: Severity;
  detectedAt: string;
  source: string;
  summary: string;
  aiExplanation: string;
  suggestedActions: string[];
}

export interface AlertItem {
  id: string;
  title: string;
  body: string;
  priority: number;
  time: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export interface WatchRow {
  symbol: string;
  name: string;
  asset: 'crypto' | 'stock' | 'fx';
  last: string;
  chgPct: number;
  vol: string;
}

export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export interface PositionRow {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  size: string;
  entry: string;
  mark: string;
  pnl: string;
  pnlPct: number;
}

export interface OrderRow {
  id: string;
  time: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'Market' | 'Limit' | 'Stop';
  qty: string;
  price: string;
  status: 'filled' | 'working' | 'cancelled';
}

export interface LearningBeat {
  id: string;
  time: string;
  title: string;
  detail: string;
  confidence: number;
}

export interface PersonalityAxis {
  id: string;
  label: string;
  score: number;
  hint: string;
}

export interface MistakePattern {
  id: string;
  label: string;
  count: number;
  impact: string;
}

export interface LabModule {
  id: string;
  name: string;
  description: string;
  status: 'ready' | 'running' | 'idle';
  lastRun?: string;
}

export interface AllocationSlice {
  id: string;
  label: string;
  pct: number;
  value: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  side: string;
  result: 'win' | 'loss' | 'scratch';
  pnl: string;
  aiNote: string;
}

export function buildCandles(seedBase: number, bars: number): Candle[] {
  const out: Candle[] = [];
  let c = seedBase;
  for (let i = 0; i < bars; i++) {
    const w = Math.sin(i * 0.35) * 0.004 + Math.cos(i * 0.12) * 0.002;
    const o = c;
    const delta = c * (w + ((i % 7) - 3) * 0.0008);
    c = Math.max(0.0001, o + delta);
    const h = Math.max(o, c) * (1 + 0.0012 + (i % 5) * 0.0001);
    const l = Math.min(o, c) * (1 - 0.0014 - (i % 4) * 0.0001);
    const v = 800_000 + (i % 13) * 120_000 + (i % 3) * 50_000;
    out.push({ o, h, l, c, v });
  }
  return out;
}

export const activeSymbol = 'BTC-PERP';

export const watchlist: WatchRow[] = [
  { symbol: 'BTC-PERP', name: 'Bitcoin perp', asset: 'crypto', last: '68,420.5', chgPct: 1.24, vol: '2.1B' },
  { symbol: 'ETH-PERP', name: 'Ethereum perp', asset: 'crypto', last: '3,842.10', chgPct: -0.42, vol: '980M' },
  { symbol: 'SOL-PERP', name: 'Solana perp', asset: 'crypto', last: '142.88', chgPct: 2.81, vol: '410M' },
  { symbol: 'NVDA', name: 'NVIDIA', asset: 'stock', last: '128.92', chgPct: 0.67, vol: '44M' },
];

export const chartCandles = buildCandles(67200, 64);

export const chartOverlayNote = {
  barIndex: 52,
  label: 'Stop run',
  text: 'You widened stop 3× vs your rule right before this wick — model flags emotional override.',
};

export const preTradeWarning =
  'Sizing is 2.4× your median for BTC — volatility percentile 91. Shield suggests half size or staged entry.';

export const metrics: Metric[] = [
  { id: 'd-pnl', label: 'Today PnL', value: '+$1,842', delta: '+0.62% day', trend: 'up' },
  { id: 'win', label: 'Win rate (30d)', value: '54%', delta: '+4% vs prior', trend: 'up' },
  { id: 'exp', label: 'Gross exposure', value: '38%', delta: 'within band', trend: 'flat' },
  { id: 'sharpe', label: 'Sharpe (90d)', value: '1.82', delta: 'est.', trend: 'up' },
];

export const insightSummary =
  'Last week you overtraded BTC in Asia session 4× vs baseline and broke stop discipline on 62% of losers. EV on revenge entries is −$340/trade — the model recommends a 15-minute cool-down gate after two consecutive stops.';

export const timeline: TimelineEvent[] = [
  { id: 't1', time: '14:02', title: 'Post-trade debrief', detail: 'SOL long — target hit; AI logged partial exit discipline.', tone: 'profit' },
  { id: 't2', time: '13:18', title: 'Pre-trade hold', detail: 'Shield blocked market buy on ETH — spread anomaly vs median.', tone: 'warn' },
  { id: 't3', time: '11:40', title: 'Journal sync', detail: '3 fills annotated with behavioral tags (FOMO, plan dev).', tone: 'info' },
  { id: 't4', time: '09:05', title: 'Model refresh', detail: 'Personality prior updated — risk aversion +6%.', tone: 'neutral' },
];

export const tradingSignals: TradingSignal[] = [
  {
    id: 's1',
    title: 'Position heatmap — BTC correlation spike',
    severity: 'high',
    detectedAt: '6 min ago',
    source: 'Risk · Cross-asset',
    summary: 'BTC beta to book jumped to 0.81 while you added alt exposure — concentration risk elevated.',
    aiExplanation:
      'Historically, when BTC correlation exceeds 0.78 and alt longs rise together, drawdowns cluster within 48h. Not a prediction — a stress prior from your own trade history.',
    suggestedActions: ['Trim alt perps 15%', 'Hedge with BTC put spread template', 'Pause new longs 2h'],
  },
  {
    id: 's2',
    title: 'Rule breach — stop widening',
    severity: 'medium',
    detectedAt: 'Yesterday',
    source: 'Behavior · Discipline',
    summary: 'Stop distance expanded mid-trade on 5/8 losers vs 1/12 winners.',
    aiExplanation:
      'Pattern matches loss aversion spikes after streak losses. Tightening default stop template may outperform discretionary widening.',
    suggestedActions: ['Enable hard stop lock for 7d', 'Review journal tags: revenge', 'Simulate same trades in Lab'],
  },
];

export const chartSeries = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  pnl: [120, 340, 280, -140, 420, 180, 260],
  trades: [12, 18, 22, 30, 14, 9, 11],
};

export const patternHighlights = [
  { label: 'Overtrade index', value: '1.34×', detail: 'vs your 90d median' },
  { label: 'Avg hold (winners)', value: '4h 12m', detail: 'Losers: 1h 04m' },
  { label: 'Plan adherence', value: '71%', detail: 'When ≥80%, expectancy +$210/d' },
];

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    title: 'Pre-trade: size cap',
    body: 'Suggested max for this setup is 0.35× current draft — tap to apply.',
    priority: 1,
    time: 'Just now',
    read: false,
  },
  {
    id: 'a2',
    title: 'Vol spike — BTC',
    body: 'Realized vol crossed 75th percentile; bracket defaults widened in Lab only.',
    priority: 2,
    time: '8 min ago',
    read: false,
  },
  {
    id: 'a3',
    title: 'Weekly alpha digest',
    body: '3 mistakes repeated — journal entries ready with AI annotations.',
    priority: 3,
    time: '1h ago',
    read: true,
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: 'j1',
    date: 'Mar 28 · 13:58',
    symbol: 'BTC-PERP',
    side: 'Long add',
    result: 'win',
    pnl: '+$128',
    aiNote: 'Plan respected; entry aligned with VWAP reclaim — keep this template.',
  },
  {
    id: 'j2',
    date: 'Mar 28 · 09:22',
    symbol: 'ETH-PERP',
    side: 'Short',
    result: 'loss',
    pnl: '−$340',
    aiNote: 'Stop widened after −0.4R — pattern matches revenge tag from Mar 21 cluster.',
  },
  {
    id: 'j3',
    date: 'Mar 27 · 16:10',
    symbol: 'SOL-PERP',
    side: 'Long scalp',
    result: 'scratch',
    pnl: '+$12',
    aiNote: 'Flat after fees — good exit discipline vs prior SOL scratches.',
  },
];

export const allocation: AllocationSlice[] = [
  { id: 'a', label: 'Crypto perps', pct: 52, value: '$284k' },
  { id: 'b', label: 'Equities', pct: 28, value: '$153k' },
  { id: 'c', label: 'FX', pct: 12, value: '$66k' },
  { id: 'd', label: 'Cash & MM', pct: 8, value: '$44k' },
];

export const labModules: LabModule[] = [
  { id: 'l1', name: 'Paper book', description: 'Full-depth sim with live feeds, no capital risk.', status: 'ready', lastRun: 'Active' },
  { id: 'l2', name: 'Backtest engine', description: 'Walk-forward on your rule templates.', status: 'idle', lastRun: '3d ago' },
  { id: 'l3', name: 'Strategy sandbox', description: 'Fork live book into isolated namespace.', status: 'running', lastRun: 'Running' },
];

export const positions: PositionRow[] = [
  { id: 'p1', symbol: 'BTC-PERP', side: 'long', size: '0.42', entry: '67,220', mark: '68,420.5', pnl: '+$504.21', pnlPct: 1.78 },
  { id: 'p2', symbol: 'ETH-PERP', side: 'short', size: '4.0', entry: '3,910', mark: '3,842.1', pnl: '+$271.60', pnlPct: 1.74 },
  { id: 'p3', symbol: 'SOL-PERP', side: 'long', size: '120', entry: '138.40', mark: '142.88', pnl: '+$537.60', pnlPct: 3.23 },
];

export const recentOrders: OrderRow[] = [
  { id: 'o1', time: '13:58', symbol: 'BTC-PERP', side: 'buy', type: 'Limit', qty: '0.10', price: '67,800', status: 'filled' },
  { id: 'o2', time: '13:12', symbol: 'ETH-PERP', side: 'sell', type: 'Stop', qty: '2.0', price: '3,950', status: 'working' },
  { id: 'o3', time: '11:02', symbol: 'SOL-PERP', side: 'buy', type: 'Market', qty: '40', price: 'MKT', status: 'filled' },
];

export const learningBeats: LearningBeat[] = [
  { id: 'lb1', time: 'Today', title: 'Cool-down gate learned', detail: 'After 2 stops, you flatline aggression — prior was 4+ revenge entries.', confidence: 0.88 },
  { id: 'lb2', time: '2d ago', title: 'Personality: risk aversion ↑', detail: 'Posterior shifted from ‘balanced’ toward ‘guardian’ on size decisions.', confidence: 0.76 },
  { id: 'lb3', time: '5d ago', title: 'Edge attribution', detail: '70% of week PnL from trend days; mean-reversion legs negative EV.', confidence: 0.82 },
];

export const personalityAxes: PersonalityAxis[] = [
  { id: 'pa1', label: 'Discipline', score: 72, hint: 'Stops & sizing' },
  { id: 'pa2', label: 'Patience', score: 64, hint: 'Wait for setup quality' },
  { id: 'pa3', label: 'Aggression', score: 58, hint: 'Size when edge clear' },
  { id: 'pa4', label: 'Adaptation', score: 81, hint: 'Regime switches' },
];

export const mistakePatterns: MistakePattern[] = [
  { id: 'm1', label: 'Stop widened mid-trade', count: 14, impact: '−$4.2k est.' },
  { id: 'm2', label: 'Asia session overtrade', count: 22, impact: '−$2.1k est.' },
  { id: 'm3', label: 'Ignored pre-trade warning', count: 9, impact: '−$1.8k est.' },
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'c1',
    role: 'assistant',
    time: 'Live',
    content:
      'I’m latched to your book and today’s tape. BTC leg is driving beta — want a one-line risk read, or should I walk the last stop-widen incident on ETH?',
  },
];

export const suggestionChips = ['Risk read', 'Last ETH mistake', 'Size this entry', 'Asia overtrade'];
