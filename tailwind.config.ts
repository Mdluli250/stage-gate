import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        chart1: '#1f77b4',
        chart2: '#ff7f0e',
        chart3: '#2ca02c',
        chart4: '#d62728',
        chart5: '#9467bd',
      }
    },
  },
  plugins: [],
} satisfies Config
