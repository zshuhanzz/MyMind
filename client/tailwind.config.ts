import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lavender: {
          50:  '#F5F0FF',
          100: '#EDE5FF',
          200: '#D4C4F5',
          300: '#B39DDB',
          400: '#9575CD',
          500: '#7E57C2',
          600: '#6A3FB5',
          700: '#553098',
          800: '#40237A',
          900: '#2C1660',
        },
        sky: {
          50:  '#F0F7FF',
          100: '#DDEEFF',
          200: '#B3D4F0',
          300: '#82B1D9',
          400: '#5C9ACE',
          500: '#3B82C4',
        },
        warmgray: {
          50:  '#FAF9F7',
          100: '#F0EEEB',
          200: '#E5E2DE',
          300: '#D1CCC6',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#4A4545',
          800: '#353030',
          900: '#2D2A2A',
        },
        rose: {
          50:  '#FFF1F3',
          100: '#FFE4E9',
          200: '#FFCCD5',
          300: '#F5A3B1',
          400: '#E57388',
        },
        sage: {
          50:  '#F1F8F1',
          100: '#E8F5E9',
          200: '#C8E6C9',
          300: '#A5D6A7',
          400: '#66BB6A',
        },
        amber: {
          50:  '#FFFBF0',
          100: '#FFF8E1',
          200: '#FFECB3',
          300: '#FFD54F',
          400: '#FFA726',
        },
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        accent:  ['Caveat', 'cursive'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'input': '10px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(179, 157, 219, 0.12)',
        'card-hover': '0 8px 32px rgba(179, 157, 219, 0.20)',
        'button': '0 2px 8px rgba(126, 87, 194, 0.25)',
        'soft': '0 2px 12px rgba(179, 157, 219, 0.08)',
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%':      { transform: 'scale(1.15)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
