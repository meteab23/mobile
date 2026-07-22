import Link from "next/link";
import { FadeIn } from "./FadeIn";

const integrations = [
  { title: "Plugin", copy: "Shopify, Shopware, Magento—live in days." },
  { title: "API", copy: "Full control with modern REST & webhooks." },
  { title: "Hosted checkout", copy: "Drop-in payment page, zero UI work." },
  { title: "ERP sync", copy: "Push settlements into your finance stack." },
];

export function Integrations() {
  return (
    <section className="section-pad atmosphere-dark text-[#f4f6f4]">
      <div className="container-narrow">
        <FadeIn>
          <p className="text-sm font-semibold tracking-[0.14em] text-accent-bright uppercase">
            Get started your way
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl tracking-[-0.04em] md:text-5xl text-balance">
            Implement today. Scale tomorrow.
          </h2>
        </FadeIn>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.map((item, i) => (
            <FadeIn key={item.title} delay={0.06 * i}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="font-display text-lg tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.copy}</p>
                <Link
                  href="/demo"
                  className="mt-6 inline-block text-sm text-accent-bright hover:text-white"
                >
                  Learn more →
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
