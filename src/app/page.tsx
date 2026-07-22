import { Ambitions } from "@/components/marketing/Ambitions";
import { Channels } from "@/components/marketing/Channels";
import { Hero } from "@/components/marketing/Hero";
import { Integrations } from "@/components/marketing/Integrations";
import { Newsletter } from "@/components/marketing/Newsletter";
import { Products } from "@/components/marketing/Products";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteNav } from "@/components/marketing/SiteNav";
import { Solutions } from "@/components/marketing/Solutions";
import { Stats } from "@/components/marketing/Stats";

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Ambitions />
        <Products />
        <Solutions />
        <Channels />
        <Stats />
        <Integrations />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  );
}
