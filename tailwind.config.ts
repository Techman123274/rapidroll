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
        primary: "#ffdf00",
        gold: "#ffd700",
        matrix: "#00ff41",
        obsidian: "#0a0a0a",
        "bg-dark": "#070707",
        "sidebar-bg": "#0d0d0d",
        "card-bg": "#121212",
        "header-bg": "#0a0a0a",
        "accent-green": "#4ade80",
        danger: "#ef4444",
        "border-color": "#1a1a1a",
      },
    },
  },
  plugins: [],
};

export default config;
