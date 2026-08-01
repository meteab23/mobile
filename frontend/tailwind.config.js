/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#f4f7fa',
          100: '#e8eef4',
          200: '#d0dce8',
          300: '#a8bdd0',
          400: '#7596b3',
          500: '#557894',
          600: '#3f5f78',
          700: '#344d61',
          800: '#2d4152',
          900: '#0b3d5c',
          950: '#0a2438',
        },
        amber: {
          brand: '#f4b942',
          deep: '#c47a12',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Impact', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 18px 50px -20px rgba(11, 61, 92, 0.35)',
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(11,61,92,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,61,92,0.06) 1px, transparent 1px)',
        hero: 'radial-gradient(ellipse at 20% 0%, rgba(244,185,66,0.18), transparent 45%), radial-gradient(ellipse at 90% 10%, rgba(26,107,138,0.22), transparent 40%), linear-gradient(160deg, #f4f7fa 0%, #e8eef4 45%, #dce8f0 100%)',
      },
      backgroundSize: {
        grid: '28px 28px',
      },
    },
  },
  plugins: [],
}
