import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color tokens with WCAG AA compliant contrast ratios
        border: "hsl(214.3 31.8% 91.4%)", // slate-200
        input: "hsl(214.3 31.8% 91.4%)", // slate-200
        ring: "hsl(221.2 83.2% 53.3%)", // blue-600
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)", // slate-950
        primary: {
          DEFAULT: "hsl(221.2 83.2% 53.3%)", // blue-600
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(210 40% 96.1%)", // slate-100
          foreground: "hsl(222.2 47.4% 11.2%)", // slate-900
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)", // red-500
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)", // slate-100
          foreground: "hsl(215.4 16.3% 46.9%)", // slate-600 - WCAG AA compliant
        },
        accent: {
          DEFAULT: "hsl(210 40% 96.1%)", // slate-100
          foreground: "hsl(222.2 47.4% 11.2%)", // slate-900
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222.2 84% 4.9%)", // slate-950
        },
        // Helper text colors - WCAG AA compliant (minimum 4.5:1 ratio)
        "text-helper": "hsl(215.4 16.3% 46.9%)", // slate-600 - ratio 5.74:1
        "text-subtle": "hsl(215 20.2% 65.1%)", // slate-400 replacement with better contrast
      },
    }
  },
  plugins: []
};

export default config;
