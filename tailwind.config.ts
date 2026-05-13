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
        background: "#f7f4ed", // Lovable Cream
        foreground: "#1c1c1c", // Lovable Charcoal
        muted: "#5f5f5d",      // Lovable Muted Gray
        border: "#eceae4",     // Lovable Light Cream Divider
        charcoal: {
          DEFAULT: "#1c1c1c",
          83: "rgba(28, 28, 28, 0.83)",
          82: "rgba(28, 28, 28, 0.82)",
          40: "rgba(28, 28, 28, 0.4)",
          4: "rgba(28, 28, 28, 0.04)",
          3: "rgba(28, 28, 28, 0.03)",
        },
        accent: {
          crimson: "#ff3b30",
          gold: "#ffcc00",
          blue: "#3b82f6", // Updated to Lovable's Ring Blue
        },
        "bg-glass": "rgba(28, 28, 28, 0.03)",
        "bg-glass-heavy": "rgba(28, 28, 28, 0.04)",
        "border-glass": "#eceae4",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 59, 48, 0.05)",
        "glow-crimson": "0 0 25px rgba(255, 59, 48, 0.1)",
        "glow-blue": "0 0 25px rgba(59, 130, 246, 0.1)",
        "button-inset": "rgba(255,255,255,0.2) 0px 0.5px 0px 0px inset, rgba(0,0,0,0.2) 0px 0px 0px 0.5px inset, rgba(0,0,0,0.05) 0px 1px 2px 0px",
        "focus-warm": "rgba(0,0,0,0.1) 0px 4px 12px",
      },
    },
  },
  plugins: [],
};
export default config;
