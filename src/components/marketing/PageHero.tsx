import type { ReactNode } from "react";
import { Pill } from "./primitives";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-brand-soft blur-[120px] opacity-70" />
      <div className="container-x relative py-20 text-center lg:py-28">
        <Reveal>
          <div className="flex justify-center">
            <Pill>{eyebrow}</Pill>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <h1 className="display mx-auto mt-6 max-w-3xl text-[clamp(2.4rem,5.5vw,4rem)] text-ink">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {subtitle}
          </p>
        </Reveal>
        {children && (
          <Reveal delay={180}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {children}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
