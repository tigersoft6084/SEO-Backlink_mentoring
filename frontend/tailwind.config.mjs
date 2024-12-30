// tailwind.config.mjs

import defaultTheme from 'tailwindcss/defaultTheme'; // Ensure this is at the top

const config = {
  darkMode: 'class', // Enables dark mode via a class
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Scan these directories for class names
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)', // Use CSS variables for background
        foreground: 'var(--foreground)', // Use CSS variables for foreground
      },
      fontFamily: {
        sans: ['"Euclid Circular A"', ...defaultTheme.fontFamily.sans], // Add custom font with fallback
      },
    },
  },
  plugins: [],
};

export default config;
