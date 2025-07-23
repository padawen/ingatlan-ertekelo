/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0c4a6e',
        'secondary-blue': '#0369a1',
        'light-blue': '#e0f2fe',
        'gold': '#b59410',
        'light-gold': '#fef9c3',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'raleway': ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 