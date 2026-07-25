import { Ambitions } from "@/components/marketing/Ambitions";
import { Channels } from "@/components/marketing/Channels";
import { CtaBand } from "@/components/marketing/CtaBand";
import { Faq } from "@/components/marketing/Faq";
import { Hero } from "@/components/marketing/Hero";
import { Products } from "@/components/marketing/Products";
import { RepaymentPreview } from "@/components/marketing/RepaymentPreview";
import { Stats } from "@/components/marketing/Stats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ambitions />
      <Products />
      <RepaymentPreview />
      <Channels />
      <Stats />
      <Faq />
      <CtaBand />
    </>
  );
}
