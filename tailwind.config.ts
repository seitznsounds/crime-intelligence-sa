import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        muted: {
          DEFAULT: "var(--muted-foreground)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border-glass)",
        charcoal: {
          DEFAULT: "var(--foreground)",
          83: "rgba(var(--foreground-rgb), 0.83)",
          82: "var(--muted-foreground)",
          40: "rgba(var(--foreground-rgb), 0.4)",
          4: "var(--bg-glass-heavy)",
          3: "var(--bg-glass)",
        },
        accent: {
          crimson: "var(--accent-crimson)",
          gold: "var(--accent-gold)",
          blue: "var(--accent-blue)",
        },
        "bg-glass": "var(--bg-glass)",
        "bg-glass-heavy": "var(--bg-glass-heavy)",
        "border-glass": "var(--border-glass)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px var(--accent-crimson-opacity)",
        "glow-crimson": "0 0 25px rgba(255, 59, 48, 0.1)",
        "glow-blue": "0 0 25px rgba(59, 130, 246, 0.1)",
        "button-inset": "rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px",
        "focus-warm": "var(--focus-shadow)",
      },
    },
  },
  plugins: [],
};
export default config;
