"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractiveTerminal } from "@/components/widgets/InteractiveTerminal";
import { LogoMarquee } from "@/components/landing/LogoMarquee";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 mesh-gradient" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 text-sm font-medium tracking-tight text-emerald-700 dark:text-emerald-400"
          >
            Intelligent B2B payments
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            The Next Standard for Intelligent B2B Payments
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Offer Buy Now, Pay Later and trade credit at checkout—while AI
            underwriting protects your cash flow and pays you upfront.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="#cta">
                Schedule Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="#terminal">
                <Play className="h-4 w-4" />
                Try the terminal
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
          className="mt-14 sm:mt-16"
        >
          <InteractiveTerminal />
        </motion.div>

        <div className="mt-16 sm:mt-20">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by modern B2B teams
          </p>
          <LogoMarquee />
        </div>
      </div>
    </section>
  );
}
