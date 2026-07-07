export type PlanId = 'free' | 'pro' | 'elite';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number;
  annualMonthly: number;
  highlight?: boolean;
  features: string[];
  footnote?: string;
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Scout',
    tagline: 'Learn the language of markets.',
    monthly: 0,
    annualMonthly: 0,
    features: [
      '3 AI signals per day (30-min delay)',
      'Plain-English reasoning on every signal',
      'Trade journal — 20 trades / month',
      '12 foundation lessons',
    ],
    footnote: 'Free forever. No card.',
  },
  {
    id: 'pro',
    name: 'Operator',
    tagline: 'Trade with the full mentor at your side.',
    monthly: 29,
    annualMonthly: 24,
    highlight: true,
    features: [
      'Unlimited real-time signals, all markets',
      'Behavioral coaching on your own patterns',
      'Unlimited journal + AI trade reviews',
      'Full lesson library & mastery tracks',
      'Backtesting (100 runs / mo)',
    ],
    footnote: 'Most traders choose Operator.',
  },
  {
    id: 'elite',
    name: 'Desk',
    tagline: "Automate the strategies you've mastered.",
    monthly: 79,
    annualMonthly: 66,
    features: [
      'Everything in Operator',
      'Strategy automation with guardrails',
      'Unlimited backtests + walk-forward',
      'Custom signal universes & alerts',
      'Priority reviews within 4 hours',
    ],
    footnote: 'Automation unlocks after mastery.',
  },
];
