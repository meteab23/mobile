import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { FeatureTabs } from "@/components/landing/FeatureTabs";
import { MetricsGrid } from "@/components/landing/MetricsGrid";
import { LeadCaptureFooter } from "@/components/landing/LeadCaptureFooter";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeatureTabs />
      <MetricsGrid />
      <LeadCaptureFooter />
    </main>
  );
}
