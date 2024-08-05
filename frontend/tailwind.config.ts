import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'sig-purple': '#561427',
        'sig-blue': '#2c3e50',
        'sig-hblue': '#1d2834',
        'sig-golden': '#d4af37',
        'sig-hgolden': '#c59b2d',
        'sig-text': '#333333',
        'sig-htext': '#262626',
        'sig-green': '#28A745',
        'sig-hgreen': '#1f7634',
        'sig-bluesky': '#17A2B8',
        'sig-hbluesky': '#196e85',
        'sig-yellow': '#FFC107',
        'sig-hyellow': '#E29400',
        'sig-red': '#DC3545',
        'sig-hred': '#b7192c',
        'sig-gray1': '#F5F5F5',
        'sig-gray2': '#D9D9D9',
        'sig-gray3': '#C3C3C3',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      spacing: {
        's1': '1.25rem',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config