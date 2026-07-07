import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Pillars } from "@/components/marketing/Pillars";
import { PricingSection } from "@/components/marketing/PricingSection";
import { SocialProof } from "@/components/marketing/SocialProof";
import { TickerTape } from "@/components/marketing/TickerTape";

export default function LandingPage() {
  return (
    <>
      <div className="ss-backdrop" aria-hidden>
        <div className="ss-grid" />
        <div className="ss-noise" />
      </div>
      <div className="relative z-10">
        <MarketingNav />
        <main>
          <TickerTape />
          <Hero />
          <HowItWorks />
          <Pillars />
          <SocialProof />
          <PricingSection />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
