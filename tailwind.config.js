/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4E1A6F',
        secondary: '#FF9201',
        accent: '#F6B308',
        'brand-purple': '#4E1A6F',
        'brand-amber': '#FF9201',
        'brand-yellow': '#F6B308',
      },
    },
  },
  plugins: [],
}
