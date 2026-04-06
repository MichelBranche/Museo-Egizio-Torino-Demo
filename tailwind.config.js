/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        papiro: '#F9F9F6',
        inchiostro: '#1A1A1A',
        oro: '#C28F59'
      },
      fontFamily: {
        gambetta: ['Cormorant', 'serif'],
        satoshi: ['DM Sans', 'sans-serif'],
        hieroglyph: ['"Noto Sans Egyptian Hieroglyphs"', 'serif'],
      }
    },
  },
  plugins:[],
}