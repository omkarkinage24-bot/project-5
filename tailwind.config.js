/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17213A', primary: { DEFAULT: '#635BEB', dark: '#4D43CF' },
        mint: '#0FBA90', coral: '#F3727A', canvas: '#F7F8FC'
      },
      fontFamily: { sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'] },
      boxShadow: { panel: '0 8px 32px rgba(31, 42, 77, .035)', glow: '0 14px 40px rgba(99,91,235,.24)' },
      keyframes: { 'fade-up': { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'translateY(0)' } } },
      animation: { 'fade-up': 'fade-up .45s ease-out both' }
    }
  },
  plugins: []
};
