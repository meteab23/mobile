"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Full-bleed OpenAI/Billie-style animated gradient mesh for the hero. */
export function GradientMesh({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 mesh-hero" />
      <motion.div
        className="absolute -left-[10%] top-[-20%] h-[70%] w-[70%] rounded-full bg-accent/30 blur-3xl"
        animate={
          reduce
            ? undefined
            : { x: [0, 40, -20, 0], y: [0, 30, -10, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[5%] top-[-10%] h-[55%] w-[55%] rounded-full bg-sand/50 blur-3xl"
        animate={
          reduce
            ? undefined
            : { x: [0, -30, 20, 0], y: [0, 40, 10, 0], scale: [1, 0.94, 1.06, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[10%] h-[50%] w-[50%] rounded-full bg-sky/40 blur-3xl"
        animate={
          reduce
            ? undefined
            : { x: [0, -25, 15, 0], y: [0, -35, 20, 0], scale: [1, 1.1, 0.95, 1] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-5%] left-[5%] h-[40%] w-[40%] rounded-full bg-coral/25 blur-3xl"
        animate={
          reduce
            ? undefined
            : { x: [0, 20, -15, 0], y: [0, -20, 25, 0] }
        }
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-multiply [background-image:url('data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />
    </div>
  );
}

/** Large gradient “picture” panel used like Billie/OpenAI product art. */
export function GradientPicture({
  className = "",
  label,
}: {
  className?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] shadow-lift ${className}`}
    >
      <div className="absolute inset-0 mesh-panel" />
      <motion.div
        className="absolute -left-1/4 top-0 h-[80%] w-[80%] rounded-full bg-sand/40 blur-2xl"
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[70%] w-[70%] rounded-full bg-sky/45 blur-2xl"
        animate={reduce ? undefined : { x: [0, -25, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-coral/30 blur-xl"
        animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative flex h-full min-h-[280px] flex-col justify-between p-8 text-white sm:min-h-[360px] sm:p-10">
        <p className="font-display text-sm font-medium tracking-wide text-white/70">
          {label ?? "Yusr visual"}
        </p>
        <div>
          <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Flexible credit.
            <br />
            Instant payout.
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Soft gradient canvases — the same calm, expansive language as
            OpenAI and Billie’s product surfaces.
          </p>
        </div>
      </div>
    </div>
  );
}
