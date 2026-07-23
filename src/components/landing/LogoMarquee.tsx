"use client";

import { cn } from "@/lib/utils";

interface PartnerLogo {
  name: string;
  abbr: string;
}

const PARTNERS: PartnerLogo[] = [
  { name: "Northwind", abbr: "NW" },
  { name: "Helios Labs", abbr: "HL" },
  { name: "Copperfield", abbr: "CF" },
  { name: "Astra Retail", abbr: "AR" },
  { name: "Vertex Supply", abbr: "VX" },
  { name: "Orbit Commerce", abbr: "OC" },
  { name: "Summit Goods", abbr: "SG" },
  { name: "Lumen Trade", abbr: "LT" },
];

export function LogoMarquee() {
  const items = [...PARTNERS, ...PARTNERS];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

      <div className="flex w-max animate-marquee gap-10 sm:gap-14">
        {items.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className={cn(
              "flex shrink-0 items-center gap-2.5 text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200"
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/80 bg-white text-[10px] font-semibold tracking-tight dark:border-neutral-800 dark:bg-neutral-950">
              {partner.abbr}
            </span>
            <span className="text-sm font-medium tracking-tight">
              {partner.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
