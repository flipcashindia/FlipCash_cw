// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ADD THIS BLOCK
      animation: {
        'infinite-scroll': 'infinite-scroll 30s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        }
      },
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
      },
      // ... your other extensions
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide', '@tailwindcss/forms') // <-- ADD THIS LINE
  ],
}