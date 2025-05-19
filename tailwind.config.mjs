/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
