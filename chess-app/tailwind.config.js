/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chess board colors
        'light-square': '#f0d9b5',
        'dark-square': '#b58863',
        'highlight-legal': 'rgba(255, 255, 0, 0.4)',
        'highlight-lastmove': 'rgba(255, 255, 0, 0.6)',
        'highlight-check': 'rgba(255, 0, 0, 0.5)',
        // UI Colors
        primary: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        background: '#1a1a1a',
        surface: '#2d2d2d',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}