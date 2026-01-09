/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // MD3 Extended Colors
        "md-sys-color-primary": "hsl(var(--md-sys-color-primary))",
        "md-sys-color-on-primary": "hsl(var(--md-sys-color-on-primary))",
        "md-sys-color-primary-container": "hsl(var(--md-sys-color-primary-container))",
        "md-sys-color-on-primary-container": "hsl(var(--md-sys-color-on-primary-container))",

        "md-sys-color-secondary": "hsl(var(--md-sys-color-secondary))",
        "md-sys-color-on-secondary": "hsl(var(--md-sys-color-on-secondary))",
        "md-sys-color-secondary-container": "hsl(var(--md-sys-color-secondary-container))",
        "md-sys-color-on-secondary-container": "hsl(var(--md-sys-color-on-secondary-container))",

        "md-sys-color-tertiary": "hsl(var(--md-sys-color-tertiary))",
        "md-sys-color-on-tertiary": "hsl(var(--md-sys-color-on-tertiary))",
        "md-sys-color-tertiary-container": "hsl(var(--md-sys-color-tertiary-container))",
        "md-sys-color-on-tertiary-container": "hsl(var(--md-sys-color-on-tertiary-container))",

        "md-sys-color-surface": "hsl(var(--md-sys-color-surface))",
        "md-sys-color-on-surface": "hsl(var(--md-sys-color-on-surface))",
        "md-sys-color-surface-container": "hsl(var(--md-sys-color-surface-container))",
        "md-sys-color-surface-container-low": "hsl(var(--md-sys-color-surface-container-low))",
        "md-sys-color-surface-container-high": "hsl(var(--md-sys-color-surface-container-high))",

        "md-sys-color-outline": "hsl(var(--md-sys-color-outline))",
        "md-sys-color-outline-variant": "hsl(var(--md-sys-color-outline-variant))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
}
