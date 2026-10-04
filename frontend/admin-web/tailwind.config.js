/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/shared-ui/**/*.jsx",
  ],
  theme: {
    extend: {
      colors: {
        "admin-bg": "#0F0E17",
        "admin-surface": "#1A1827",
        "admin-accent": "#8B5CF6",
        "background-dark": "#0F0E17",
        "surface-dark": "#1A1827",
        "primary": "#8B5CF6",
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
      keyframes: {
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
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "float": "float 5s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out infinite",
        "rotate-slow": "rotate-slow 4s linear infinite",
        "slide-in-right": "slide-in-right 0.25s ease-out forwards",
        "slide-out-right": "slide-out-right 0.25s ease-in forwards",
        "fade-in": "fade-in 0.2s ease-in forwards",
      },
    },
  },
  plugins: [],
};
