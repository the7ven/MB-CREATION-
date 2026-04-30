/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // Si tu as des fichiers à la racine sans src, ajoute-les aussi :
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F4DF4E',
          dark: '#AA8A2E',
        },
      },
      fontFamily: {
        sans: ['var(--font-cormorant)', 'serif'],
      },
    },
  },
  plugins: [],
}