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
        background: "var(--background)",
        foreground: "var(--foreground)",
        sand: {
          50: "#F7F5F1",
          100: "#F0EDE6",
          200: "#E4DFD4",
          300: "#D2CBBA",
        },
        ink: {
          50: "#F4F5F4",
          100: "#E6E8E6",
          200: "#C8CCC8",
          300: "#9AA19A",
          400: "#6B736B",
          500: "#3F4740",
          600: "#2A312B",
          700: "#1C221D",
          800: "#121712",
          900: "#0B0F0C",
        },
        gulf: {
          50: "#EEF6F3",
          100: "#D5EBE3",
          200: "#A9D6C6",
          300: "#6FB89A",
          400: "#3D9573",
          500: "#2D6A4F",
          600: "#245A42",
          700: "#1B4633",
          800: "#143628",
        },
        tide: {
          400: "#3A7CA5",
          500: "#1A5F7A",
          600: "#144C62",
        },
        clay: {
          400: "#D4A373",
          500: "#BC6C25",
          600: "#9A561C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(18, 23, 18, 0.04), 0 8px 24px rgba(18, 23, 18, 0.06)",
        lift: "0 12px 40px rgba(18, 23, 18, 0.1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
        "fade-in": "fade-in 0.35s ease-out both",
        "pulse-dot": "pulse-dot 1s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
