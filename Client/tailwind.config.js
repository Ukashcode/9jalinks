/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy: authority, trust — the platform's "official" voice
        primary: {
          50: '#EEF1F7',
          100: '#D5DCEA',
          300: '#8698C1',
          500: '#2E4374',
          700: '#1B2A4A',
          900: '#101B32',
        },
        // Warm gold: the badge/seal color, used only for verification cues
        accent: {
          100: '#FBEBCF',
          300: '#F0C77C',
          500: '#E8A33D',
          700: '#B87A20',
        },
        // Success green: reserved specifically for "verified" states
        success: {
          100: '#DBF2E5',
          500: '#2F9E68',
          700: '#227A4F',
        },
        surface: '#FAF8F3',
        ink: '#1E2433',
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};