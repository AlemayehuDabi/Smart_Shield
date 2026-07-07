import { cn } from "@/components/ui/cn";
import { Reveal } from "./Reveal";
import {
  AutomationMock,
  EducationMock,
  PortfolioMock,
  SignalsFeedMock,
} from "./PillarMocks";

interface Pillar {
  index: string;
  kicker: string;
  accent: string;
  title: string;
  body: string;
  bullets: string[];
  mock: React.ReactNode;
}

const pillars: Pillar[] = [
  {
    index: "01",
    kicker: "Signals",
    accent: "var(--ss-accent)",
    title: "Signals that argue their case.",
    body: "Every call ships with a confidence score, exact entry, target and stop — and a plain-English chain of reasoning you can interrogate. If you can't explain the trade, you shouldn't take it. Now you always can.",
    bullets: [
      "Crypto, stocks and FX — filtered to your universe",
      "Confidence scored against the model's own track record",
      "Reasoning links every indicator to a lesson",
    ],
    mock: <SignalsFeedMock />,
  },
  {
    index: "02",
    kicker: "Portfolio intelligence",
    accent: "var(--ss-chart-1)",
    title: "Your trading, seen clearly for the first time.",
    body: "Journal every trade in seconds, then let the coach find what you can't see: the revenge trades, the winners cut early, the sessions where you bleed. Benchmarked against the market, so you know if your edge is real.",
    bullets: [
      "P&L, exposure and drawdown vs benchmark",
      "Behavioral pattern detection on your own history",
      "AI trade reviews on every journal entry",
    ],
    mock: <PortfolioMock />,
  },
  {
    index: "03",
    kicker: "Education",
    accent: "var(--ss-violet)",
    title: "Lessons that arrive exactly when they matter.",
    body: "No 40-hour course up front. When a signal uses RSI divergence and you haven't mastered it, a three-minute lesson appears — anchored to the live chart that triggered it. Concepts stick because the stakes are real.",
    bullets: [
      "140+ lessons, unlocked in context, never as homework",
      "Mastery checks that gate real progression",
      "Hover any term, anywhere, for an instant explainer",
    ],
    mock: <EducationMock />,
  },
  {
    index: "04",
    kicker: "Automation — earned",
    accent: "var(--ss-gold)",
    title: "Automate only what you've mastered.",
    body: "Build strategies from rules you understand, backtest them, paper-trade them — and only when you've proven mastery does live automation unlock. With guardrails and a kill switch you control. Coming soon; the gate is the product.",
    bullets: [
      "Visual rule builder — no code required",
      "Mastery gate: lessons + paper record before live",
      "Hard guardrails: loss caps, drawdown limits, kill switch",
    ],
    mock: <AutomationMock />,
  },
];

export function Pillars() {
  return (
    <section id="product" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow mb-4">The system</p>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
            Four pillars. One loop that compounds.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--ss-text-muted)]">
            Signal apps make you dependent. Courses make you bored. Smart Shield closes the loop
            between seeing a trade, understanding it, reviewing it, and eventually automating it.
          </p>
        </Reveal>

        <div className="mt-20 space-y-24 sm:space-y-28">
          {pillars.map((p, i) => (
            <Reveal key={p.index}>
              <div
                className={cn(
                  "grid items-center gap-10 lg:gap-16",
                  "lg:grid-cols-2"
                )}
              >
                <div className={cn(i % 2 === 1 && "lg:order-2")}>
                  <p
                    className="ss-eyebrow mb-3 flex items-center gap-2.5"
                    style={{ color: p.accent }}
                  >
                    <span className="ss-tabular">{p.index}</span>
                    <span className="h-px w-8" style={{ background: p.accent, opacity: 0.5 }} />
                    {p.kicker}
                  </p>
                  <h3 className="font-display text-balance text-2xl font-semibold tracking-tight sm:text-[1.9rem] sm:leading-[1.15]">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-[var(--ss-text-muted)]">
                    {p.body}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-[var(--ss-text-muted)]">
                        <span
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: p.accent }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={cn("relative", i % 2 === 1 && "lg:order-1")}>
                  <div
                    aria-hidden
                    className="absolute -inset-6 -z-10 rounded-3xl opacity-60"
                    style={{
                      background: `radial-gradient(ellipse 70% 70% at 50% 50%, color-mix(in srgb, ${p.accent} 7%, transparent), transparent 75%)`,
                    }}
                  />
                  {p.mock}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
