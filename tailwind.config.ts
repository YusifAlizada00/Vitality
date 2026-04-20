import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mint: { DEFAULT: "#F7FFF7", deep: "#E8F8E8" },
        emerald: { vitality: "#2ECC71", dark: "#27AE60" },
        sky: { vitality: "#3498DB", soft: "#EBF5FB" },
        sunset: { vitality: "#E67E22", soft: "#FDEBD0" },
      },
      fontFamily: {
        sans: ["var(--font-lexend)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(46, 204, 113, 0.12), 0 8px 32px -8px rgba(52, 152, 219, 0.08)",
        cardHover: "0 8px 32px -6px rgba(46, 204, 113, 0.2), 0 16px 48px -12px rgba(52, 152, 219, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
