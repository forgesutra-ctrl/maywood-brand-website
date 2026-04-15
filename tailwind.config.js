/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ivory: '#F7F3ED',
          'ivory-deep': '#EDE8DF',
          charcoal: '#1C1915',
          'charcoal-mid': '#2E2B26',
          'charcoal-soft': '#3D3A34',
          brass: '#B8965A',
          'brass-light': '#D4B483',
          'brass-pale': '#EFE0C0',
          mist: '#8C8880',
          'mist-light': '#B5B0A8',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },
    },
  },
  plugins: [],
}
