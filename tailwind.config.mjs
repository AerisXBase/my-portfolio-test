// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
        pressstart: ["'Press Start 2P'", "cursive"],
        exile: ["'Exile Static'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
