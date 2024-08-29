/** @type {import('tailwindcss').Config} */

// const headlessuiPlugin = require('@headlessui/tailwindcss');
const formsPlugin = require('@tailwindcss/forms');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        superPurple: '#6001D2',
      },
      animation: {
        'fade-in': 'fade-in 0.5s linear forwards',
        marquee: 'marquee var(--marquee-duration) linear infinite',
        'spin-slow': 'spin 4s linear infinite',
        'spin-slower': 'spin 6s linear infinite',
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'spin-reverse-slow': 'spin-reverse 4s linear infinite',
        'spin-reverse-slower': 'spin-reverse 6s linear infinite',
        float: 'float 3s ease-in-out infinite', // Define the animation with keyframes
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      // colors: ({ colors }) => ({
      //   gray: colors.neutral,
      // }),
      // fontFamily: {
      //   sans: 'var(--font-inter)',
      // },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        marquee: {
          '100%': {
            transform: 'translateY(-50%)',
          },
        },
        'spin-reverse': {
          to: {
            transform: 'rotate(-360deg)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(5px)' },
          '50%': { transform: 'translateY(-2px)' },
          '75%': { transform: 'translateY(5px)' },
        },
      },
      maxWidth: {
        '2xl': '40rem',
      },
    },
  },
  plugins: [formsPlugin],
}
