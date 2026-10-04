import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        meesho: {
          50: "#fdf2f9",
          100: "#fbe8f4",
          200: "#f6d0ea",
          300: "#f0a8d7",
          400: "#e372bc",
          500: "#d347a1",
          600: "#b82b84",
          700: "#9f2089",
          800: "#821b6a",
          900: "#6a1b55",
          950: "#440833",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -2px rgba(159, 32, 137, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)",
        card: "0 12px 36px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)",
        elevated: "0 20px 48px -8px rgba(159, 32, 137, 0.16), 0 8px 20px -4px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
