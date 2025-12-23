/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme palette
        dark: {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#4a4a4a',
        },
        // Status colors
        status: {
          active: '#22c55e',
          inactive: '#6b7280',
          pending: '#f59e0b',
          error: '#ef4444',
          processing: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}
