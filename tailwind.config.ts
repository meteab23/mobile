import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          muted: "var(--ink-muted)",
        },
        paper: {
          DEFAULT: "var(--paper)",
          soft: "var(--paper-soft)",
          elev: "var(--paper-elev)",
        },
        line: "var(--line)",
        accent: {
          DEFAULT: "var(--accent)",
          deep: "var(--accent-deep)",
          soft: "var(--accent-soft)",
          glow: "var(--accent-glow)",
        },
        sand: "var(--sand)",
        sky: "var(--sky)",
        coral: "var(--coral)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        shell: "72rem",
        prose: "40rem",
      },
      boxShadow: {
        lift: "0 18px 50px -28px rgba(15, 23, 22, 0.35)",
        soft: "0 10px 40px -24px rgba(15, 23, 22, 0.2)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(2%, -3%) scale(1.04)" },
          "66%": { transform: "translate(-2%, 2%) scale(0.98)" },
        },
        "drift-slow": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "50%": { transform: "translate(-3%, 4%) rotate(4deg)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        "drift-slow": "drift-slow 18s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        shimmer: "shimmer 8s ease infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
