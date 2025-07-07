// tailwind.config.js (ESM)
import scrollbar from 'tailwind-scrollbar';
import typography from '@tailwindcss/typography';


/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [scrollbar,typography],
};

export default config;
