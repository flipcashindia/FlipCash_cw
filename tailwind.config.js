/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    theme: {
    extend: {
      colors: {
        'brand': {
          // As per the branding guide [cite: 833, 834, 837, 838]
          yellow: '#FEC925',
          black: '#1C1C1B',
          green: '#1B8A05',
          red: '#FF0000',
          // Tints & Greys [cite: 839, 840]
          'gray-light': '#F5F5F5',
          'aqua-tint': '#EAF6F4',
        }
      }
    },
  },
  },
  plugins: [
    require('@tailwindcss/forms'), // This will make our form inputs look great
  ],
}