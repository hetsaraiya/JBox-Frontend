/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBackground: '#1A1A1D',
        lightBackground: '#FAF6E3s',
      },
    },
  },
  plugins: [],
};