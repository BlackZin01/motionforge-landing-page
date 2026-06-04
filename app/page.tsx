import { AudienceFit } from "@/components/landing/audience-fit";
import { Comparison } from "@/components/landing/comparison";
import { CredibilityStrip } from "@/components/landing/credibility-strip";
import { ExtraCredits } from "@/components/landing/extra-credits";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Navbar } from "@/components/landing/navbar";
import { OperatorBenefits } from "@/components/landing/operator-benefits";
import { Pricing } from "@/components/landing/pricing";
import { StudioShowcase } from "@/components/landing/studio-showcase";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />
        <CredibilityStrip />
        <HowItWorks />
        <StudioShowcase />
        <OperatorBenefits />
        <AudienceFit />
        <Comparison />
        <Pricing />
        <ExtraCredits />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}
