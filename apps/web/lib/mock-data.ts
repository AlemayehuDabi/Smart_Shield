export type SystemState = "safe" | "warning" | "critical";

export type Severity = "low" | "medium" | "high" | "critical";

export interface Metric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: "neutral" | "info" | "warn" | "danger";
}

export interface Threat {
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
  role: "user" | "assistant";
  content: string;
  time: string;
}

export interface ModuleCard {
  id: string;
  name: string;
  description: string;
  status: "active" | "standby" | "learning";
  load: number;
}

export const systemState: SystemState = "warning";

export const metrics: Metric[] = [
  {
    id: "risk",
    label: "Composite risk",
    value: "34",
    delta: "−6 vs 24h",
    trend: "down",
  },
  {
    id: "coverage",
    label: "Protected surfaces",
    value: "12",
    delta: "+2 this week",
    trend: "up",
  },
  {
    id: "signals",
    label: "Signals ingested",
    value: "842k",
    delta: "steady",
    trend: "flat",
  },
  {
    id: "latency",
    label: "Decision latency",
    value: "118ms",
    delta: "p95",
    trend: "flat",
  },
];

export const insightSummary =
  "Behavior drift detected on two endpoints after 02:00 UTC. Correlation with new deployment v2.14.3 is 0.81. Smart Shield tightened policy on outbound automation and queued a human-readable brief for your team.";

export const timeline: TimelineEvent[] = [
  {
    id: "t1",
    time: "09:41",
    title: "Policy tightened",
    detail: "Automation scope reduced for workspace “Northwind”.",
    tone: "warn",
  },
  {
    id: "t2",
    time: "09:12",
    title: "Model refresh",
    detail: "Inference graph v4.2 promoted to canary (12% traffic).",
    tone: "info",
  },
  {
    id: "t3",
    time: "08:56",
    title: "Anomaly cleared",
    detail: "Spike in API keys matched scheduled CI rotation.",
    tone: "neutral",
  },
  {
    id: "t4",
    time: "08:02",
    title: "New integration",
    detail: "SIEM connector verified — 14 rules active.",
    tone: "info",
  },
];

export const threats: Threat[] = [
  {
    id: "th-1",
    title: "Unfamiliar OAuth consent pattern",
    severity: "high",
    detectedAt: "12 min ago",
    source: "Identity · OAuth",
    summary:
      "User agent and geo velocity diverged from the last 30-day baseline within a 4-minute window.",
    aiExplanation:
      "The sequence matches staged consent phishing: rapid device swap, shortened session, and elevated scope requests. Confidence is high but not absolute — recommend verify-in-app rather than hard lockout.",
    suggestedActions: [
      "Step-up verification for affected identities",
      "Compare against IdP risk events",
      "Notify security champion channel",
    ],
  },
  {
    id: "th-2",
    title: "Data exfil shape on object store",
    severity: "medium",
    detectedAt: "47 min ago",
    source: "Storage · S3-compatible",
    summary:
      "Burst read on cold prefixes with sequential object keys — atypical for your product traffic.",
    aiExplanation:
      "Pattern resembles inventory scraping or misconfigured backup job. No deletion observed. Suggest correlate with ETL schedules before escalating.",
    suggestedActions: [
      "Tag job ownership on the prefix",
      "Enable temporary read throttle",
      "Open timeline with Storage team",
    ],
  },
  {
    id: "th-3",
    title: "TLS fingerprint mismatch",
    severity: "low",
    detectedAt: "2h ago",
    source: "Edge · TLS",
    summary:
      "Client hello differs from known mobile builds — possible custom proxy or outdated SDK.",
    aiExplanation:
      "Low severity: could be corporate SSL inspection. Monitor for credential stuffing adjacency.",
    suggestedActions: ["Sample HAR from user cohort", "Ignore if expected region"],
  },
];

export const chartSeries = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  risk: [42, 38, 41, 39, 36, 34, 34],
  activity: [120, 132, 128, 140, 156, 148, 162],
};

export const patternHighlights = [
  { label: "Quiet hours lift", value: "+18%", detail: "API calls 01:00–04:00 UTC" },
  { label: "Human vs automation", value: "63 / 37", detail: "Rolling 7d blend" },
  { label: "Repeat offenders", value: "4", detail: "Entities over risk threshold" },
];

export const alerts: AlertItem[] = [
  {
    id: "a1",
    title: "Canary promotion paused",
    body: "Automatic rollout stopped after guardrail breach on error budget.",
    priority: 1,
    time: "Just now",
    read: false,
  },
  {
    id: "a2",
    title: "New high-severity item",
    body: "OAuth pattern requires review in Threat panel.",
    priority: 2,
    time: "12 min ago",
    read: false,
  },
  {
    id: "a3",
    title: "Weekly digest ready",
    body: "Executive summary generated — 3 actions suggested.",
    priority: 3,
    time: "1h ago",
    read: true,
  },
];

export const modules: ModuleCard[] = [
  {
    id: "m1",
    name: "Neural core",
    description: "Reasoning, retrieval, and policy synthesis.",
    status: "active",
    load: 72,
  },
  {
    id: "m2",
    name: "Live monitor",
    description: "Streams, metrics, and trace stitching.",
    status: "active",
    load: 54,
  },
  {
    id: "m3",
    name: "Perimeter",
    description: "Edge rules, WAF adjacency, and TLS analytics.",
    status: "learning",
    load: 38,
  },
  {
    id: "m4",
    name: "Identity fabric",
    description: "Sessions, tokens, and step-up orchestration.",
    status: "active",
    load: 61,
  },
  {
    id: "m5",
    name: "Data vault",
    description: "Classification, DLP hooks, and exfil heuristics.",
    status: "standby",
    load: 12,
  },
  {
    id: "m6",
    name: "Automation guard",
    description: "Bot boundaries and human-in-the-loop gates.",
    status: "active",
    load: 44,
  },
];

export const initialMessages: ChatMessage[] = [
  {
    id: "c1",
    role: "assistant",
    time: "09:40",
    content:
      "I’m synced to today’s signals. The OAuth anomaly is the highest-impact thread — want a one-paragraph exec brief or a technical trace?",
  },
];
