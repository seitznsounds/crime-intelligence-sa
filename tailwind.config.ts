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
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          crimson: "#ff3b30",
          gold: "#ffcc00",
          blue: "#007aff",
        }
      },
      fontFamily: {
        sans: ["var(--font-outfit)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 59, 48, 0.15)",
        "glow-blue": "0 0 20px rgba(0, 122, 255, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
