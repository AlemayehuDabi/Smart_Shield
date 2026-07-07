export type PlanId = "free" | "pro" | "elite";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthly: number; // USD / month
  annualMonthly: number; // effective monthly when billed annually
  cta: string;
  highlight?: boolean;
  features: string[];
  footnote?: string;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Scout",
    tagline: "Learn the language of markets.",
    monthly: 0,
    annualMonthly: 0,
    cta: "Start free",
    features: [
      "3 AI signals per day (30-min delay)",
      "Plain-English reasoning on every signal",
      "Trade journal — 20 trades / month",
      "12 foundation lessons",
      "Portfolio snapshot & basic P&L",
    ],
    footnote: "Free forever. No credit card.",
  },
  {
    id: "pro",
    name: "Operator",
    tagline: "Trade with the full mentor at your side.",
    monthly: 29,
    annualMonthly: 24,
    cta: "Start 14-day trial",
    highlight: true,
    features: [
      "Unlimited real-time signals, all markets",
      "Behavioral coaching on your own patterns",
      "Unlimited journal + AI trade reviews",
      "Full lesson library & mastery tracks",
      "Benchmark & exposure analytics",
      "Strategy backtesting (100 runs / mo)",
    ],
    footnote: "Most traders choose Operator.",
  },
  {
    id: "elite",
    name: "Desk",
    tagline: "Automate the strategies you've mastered.",
    monthly: 79,
    annualMonthly: 66,
    cta: "Start 14-day trial",
    features: [
      "Everything in Operator",
      "Strategy automation with guardrails",
      "Unlimited backtests + walk-forward",
      "Custom signal universes & alerts",
      "Priority reviews within 4 hours",
      "Early access to new models",
    ],
    footnote: "Automation unlocks per-strategy, after mastery.",
  },
];
