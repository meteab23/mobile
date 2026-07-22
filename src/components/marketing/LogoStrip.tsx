const logos = [
  "Northwind",
  "Contoso",
  "Umbrella Supply",
  "Meridian",
  "Foundry Co.",
  "Brightwell",
  "Hanseatic",
  "Vantage Labs",
];

export function LogoStrip() {
  return (
    <section className="border-y border-line bg-bg py-10">
      <div className="container-x">
        <p className="text-center text-sm text-ink-muted">
          Trusted by modern B2B sellers moving{" "}
          <span className="font-medium text-ink">€2.4B+</span> in annual GMV
        </p>
      </div>
      <div className="relative mt-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
        <div className="flex w-max animate-marquee gap-14 pr-14">
          {[...logos, ...logos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-xl font-semibold tracking-tight text-ink/35"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
