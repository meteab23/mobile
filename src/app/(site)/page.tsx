import { Hero } from "@/components/marketing/Hero";
import { LogoStrip } from "@/components/marketing/LogoStrip";
import { ValueProps } from "@/components/marketing/ValueProps";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase";
import { Stats } from "@/components/marketing/Stats";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <ValueProps />
      <HowItWorks />
      <FeatureShowcase />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}
