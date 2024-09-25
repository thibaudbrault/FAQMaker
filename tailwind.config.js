/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-merriweather)'],
        sans: ['var(--font-inter)'],
      },
      boxShadow: {
        sm: '0 0 0 1px',
      },
      borderColor: {
        primary: 'var(--gray-6)',
        accent: 'var(--teal-6)'
      },
      backgroundColor: {
        divider: 'var(--gray-6)',
        primary: {
          DEFAULT: 'var(--gray-1)',
          foreground: {
            DEFAULT: 'var(--gray-3)',
            hover: 'var(--gray-4)',
            active: 'var(--gray-4)',
            alpha: 'var(--gray-a3)'
          },
          negative: {
            DEFAULT: 'var(--gray-12)',
            hover: 'var(--gray-11)',
            disabled: 'var(--gray-10)'
          },
        },
        destructive: {
          DEFAULT: 'var(--red-6)',
          hover: 'var(--red-5)',
          disabled: {
            DEFAULT: '#fff5f5cc',
            dark: '#2f151780'
          }
        },
      },
      boxShadowColor: {
        primary: {
          DEFAULT: 'var(--gray-a7)',
          hover: 'var(--gray-a8)',
        },
        accent: {
          DEFAULT: 'var(--teal-a7)',
          hover: 'var(--teal-a8)',
          focus: 'var(--teal-10)',
        },
        destructive: {
          DEFAULT: 'var(--red-a7)',
          hover: 'var(--red-a8)',
        }
      },
      textColor: {
        primary: {
          DEFAULT: 'var(--gray-12)',
          muted: 'var(--gray-11)',
          negative: 'var(--gray-1)'
        },
        accent: {
          DEFAULT: 'var(--teal-9)',
          focus: 'var(--teal-10)',
          secondary: 'var(--teal-11)',
        },
        destructive: {
          DEFAULT: 'var(--red-9)',
          hover: 'var(--red-10)'
        }
      },
      colors: {
        teal: {
          1: 'var(--teal-1)',
          2: 'var(--teal-2)',
          3: 'var(--teal-3)',
          4: 'var(--teal-4)',
          5: 'var(--teal-5)',
          6: 'var(--teal-6)',
          7: 'var(--teal-7)',
          8: 'var(--teal-8)',
          9: 'var(--teal-9)',
          10: 'var(--teal-10)',
          11: 'var(--teal-11)',
          12: 'var(--teal-12)',
          surfaceDark: '#13272580',
          surfaceLight: '#f0faf8cc',
        },
        tealA: {
          1: 'var(--teal-a1)',
          2: 'var(--teal-a2)',
          3: 'var(--teal-a3)',
          4: 'var(--teal-a4)',
          5: 'var(--teal-a5)',
          6: 'var(--teal-a6)',
          7: 'var(--teal-a7)',
          8: 'var(--teal-a8)',
          9: 'var(--teal-a9)',
          10: 'var(--teal-a10)',
          11: 'var(--teal-a11)',
          12: 'var(--teal-a12)',
        },
        red: {
          1: 'var(--red-1)',
          2: 'var(--red-2)',
          3: 'var(--red-3)',
          4: 'var(--red-4)',
          5: 'var(--red-5)',
          6: 'var(--red-6)',
          7: 'var(--red-7)',
          8: 'var(--red-8)',
          9: 'var(--red-9)',
          10: 'var(--red-10)',
          11: 'var(--red-11)',
          12: 'var(--red-12)',
          surfaceDark: '#2f151780',
          surfaceLight: '#fff5f5cc',
        },
        redA: {
          1: 'var(--red-a1)',
          2: 'var(--red-a2)',
          3: 'var(--red-a3)',
          4: 'var(--red-a4)',
          5: 'var(--red-a5)',
          6: 'var(--red-a6)',
          7: 'var(--red-a7)',
          8: 'var(--red-a8)',
          9: 'var(--red-a9)',
          10: 'var(--red-a10)',
          11: 'var(--red-a11)',
          12: 'var(--red-a12)',
        },
        gray: {
          1: 'var(--gray-1)',
          2: 'var(--gray-2)',
          3: 'var(--gray-3)',
          4: 'var(--gray-4)',
          5: 'var(--gray-5)',
          6: 'var(--gray-6)',
          7: 'var(--gray-7)',
          8: 'var(--gray-8)',
          9: 'var(--gray-9)',
          10: 'var(--gray-10)',
          11: 'var(--gray-11)',
          12: 'var(--gray-12)',
        },
        grayA: {
          1: 'var(--gray-a1)',
          2: 'var(--gray-a2)',
          3: 'var(--gray-a3)',
          4: 'var(--gray-a4)',
          5: 'var(--gray-a5)',
          6: 'var(--gray-a6)',
          7: 'var(--gray-a7)',
          8: 'var(--gray-a8)',
          9: 'var(--gray-a9)',
          10: 'var(--gray-a10)',
          11: 'var(--gray-a11)',
          12: 'var(--gray-a12)',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
