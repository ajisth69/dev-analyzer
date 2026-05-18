/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFDF7',
        surface: '#FFF9E6',
        primary: '#E8A800',
        accent: '#D4780A',
      }
    },
  },
  plugins: [],
}
