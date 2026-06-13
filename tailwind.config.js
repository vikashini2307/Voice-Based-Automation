/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0f0f1a",
        "card-bg": "rgba(255,255,255,0.08)",
        "accent-light": "#fbbf24",
        "accent-fan": "#60a5fa",
        "accent-door": "#34d399",
        "accent-mic": "#f87171",
      },
      backgroundColor: {
        base: "#0f0f1a",
      },
    },
  },
  plugins: [],
};
