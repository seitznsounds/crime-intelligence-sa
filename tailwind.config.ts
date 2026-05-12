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
        "muted-foreground": "var(--muted-foreground)",
        accent: {
          crimson: "#ff3b30",
          gold: "#ffcc00",
          blue: "#007aff",
        },
        "bg-glass": "var(--bg-glass)",
        "bg-glass-heavy": "var(--bg-glass-heavy)",
        "border-glass": "var(--border-glass)",
        "border-glass-bright": "var(--border-glass-bright)",
        "accent-crimson-opacity": "var(--accent-crimson-opacity)",
      },
      fontFamily: {
        sans: ["var(--font-outfit)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 59, 48, 0.15)",
        "glow-crimson": "0 0 25px rgba(255, 59, 48, 0.2)",
        "glow-blue": "0 0 25px rgba(0, 122, 255, 0.15)",
        "glow-gold": "0 0 25px rgba(255, 204, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
