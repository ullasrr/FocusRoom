// tailwind.config.js (ESM)
import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [scrollbar],
};

export default config;
