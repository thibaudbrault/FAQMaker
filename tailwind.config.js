/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-merriweather)'],
        sans: ['var(--font-inter)']
      },
      textColor: {
        default: "var(--color-text)",
        offset: "var(--color-text-offset)",
        accent: "var(--color-text-accent)",
        negative: "var(--color-text-negative)",
        negativeOffset: "var(--color-text-negative-offset)",
        error: "var(--color-text-error)"
      },
      backgroundColor: {
        default: "var(--color-background)",
        offset: "var(--color-background-offset)",
        accent: "var(--color-background-accent)",
        accentGhost: "var(--color-background-accent-ghost)",
        negative: "var(--color-background-negative)",
        negativeOffset: "var(--color-background-negative-offset)",
        disabled: "var(--color-background-disabled)"
      },
      borderColor: {
        default: "var(--color-border)",
        ghost: "var(--color-border-ghost)",
        accent: "var(--color-border-accent)",
        negative: "var(--color-border-negative)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}