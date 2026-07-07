import { ChevronDown } from "@/components/ui/icons";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "Is this financial advice?",
    a: "No. Smart Shield is an analytics and education tool. Signals are model-generated market analysis with transparent reasoning — what you trade, and whether you trade at all, is entirely your decision on your own broker. We publish our methodology and historical accuracy so you can judge the model like you'd judge any analyst.",
  },
  {
    q: "Do you connect to my broker or hold my money?",
    a: "Never. There's no broker API key, no custody, and no order routing in the core product. You trade wherever you already trade. The future automation tier executes only through connections you explicitly grant, with hard guardrails and a kill switch — and it's locked until you've demonstrated mastery of the strategy it runs.",
  },
  {
    q: "Which markets do you cover?",
    a: "Crypto (majors and top-100 alts), US equities and ETFs, and major FX pairs at launch. You choose your universe during onboarding, and signals are filtered to what you actually trade.",
  },
  {
    q: "What does “earning automation” actually mean?",
    a: "Each strategy has a mastery gate: complete the lessons behind its logic, pass the mastery checks, and paper-trade it with plan-adherence above threshold. Pass the gate and that specific strategy becomes eligible for automation. It's the opposite of handing a black box your money.",
  },
  {
    q: "How is the confidence score calculated?",
    a: "Every published setup is scored against the model's own historical performance on similar conditions — same pattern, regime, and timeframe. A 84% confidence means comparable setups resolved favorably at that rate in backtests and live tracking. We show the sample, not just the number.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — self-serve, effective at the end of the billing period, and your journal and progress export with you. The free tier stays free forever.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-[var(--ss-border)] px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className="ss-eyebrow mb-4">FAQ</p>
          <h2 className="font-display text-balance text-3xl font-semibold tracking-tight sm:text-[2.4rem] sm:leading-[1.12]">
            Fair questions, straight answers.
          </h2>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-[var(--ss-text-muted)]">
            Trading tools have earned your skepticism. Here&rsquo;s exactly where we stand on the
            things that matter.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="divide-y divide-[var(--ss-border)] rounded-2xl border border-[var(--ss-border)] bg-[var(--ss-bg-elevated)]/60">
            {faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4.5 text-[14.5px] font-medium transition-colors hover:text-[var(--ss-accent)] sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-[var(--ss-text-faint)] transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-[var(--ss-text-muted)] sm:px-6">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
