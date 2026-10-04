/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/shared-ui/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        "secondary": "var(--color-secondary)",
        "accent": "var(--color-accent)",
        "success": "var(--color-success)",
        "warning": "var(--color-warning)",
        "danger": "var(--color-danger)",
        "background-dark": "var(--color-background-dark)",
        "surface": "var(--color-surface)",
        "border": "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-muted": "var(--color-text-muted)",
        "mrp": "var(--color-mrp)",
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(120deg, var(--color-primary), var(--color-primary-hover))",
        "luxury-gradient": "linear-gradient(135deg, #0F0E17 0%, #1A0533 100%)",
        "hero-gradient": "linear-gradient(to right bottom, rgba(15,14,23,0.8), rgba(139,92,246,0.15))",
        "card-gradient": "linear-gradient(145deg, rgba(26,24,39,0.85) 0%, rgba(26,24,39,0.6) 100%)",
      },
      keyframes: {
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0.8,0,1,1)" },
          "50%": { transform: "translateY(-12px)", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px) rotate(-5deg)" },
          "75%": { transform: "translateX(5px) rotate(5deg)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease both",
        "float": "float 5s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out infinite",
        "rotate-slow": "rotate-slow 4s linear infinite",
      },
    },
  },
  plugins: [],
};
