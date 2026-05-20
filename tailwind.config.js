/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'panel-red': '#d13b0b',
        'panel-red-stroke': '#9e2d08',
        'accent-blue': '#009cde',
        'primary-text': '#262626',
        'brand-primary': '#003b5c',
        'btn-secondary-bg': '#f5f5f5',
        'btn-secondary-stroke': '#b0b0b0',
        'btn-secondary-label': '#595959',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
        sfpro: ['"SF Pro Text"', '-apple-system', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0px 2px 6px rgba(0,0,0,0.25), 0px 0px 14px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
