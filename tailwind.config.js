/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
    },
    extend: {
      fontSize: {
        // Fluid body text: clamp(14px, 1.5vw, 20px)
        'fluid-base': ['clamp(0.875rem, 1.5vw, 1.25rem)', { lineHeight: '1.75' }],
      },
      minHeight: {
        screen: '100dvh',
      },
    },
  },
  plugins: [],
}

