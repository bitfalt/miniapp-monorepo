import type { Config } from "tailwindcss";

const colors = {
  base: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    white: '#FFFFFF',
  },
  brand: {
    primary: '#4ECCA3',
    secondary: '#387478',
    tertiary: '#2C5154',
  },
  neutral: {
    bg: '#EEEEEE',
    black: '#232931',
    grey: '#393E46',
    white: '#232931'
  },
  accent: {
    red: '#E36C59',
    orange: '#DA9540',
    blue: '#778BAD',
    teal: '#42888D',
    redSoft: '#D87566',
  }
};

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/providers/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    'h-5',
    'shadow-[0px_4px_4px_rgba(0,0,0,0.25)]',
    'rounded-[15px]'
  ],
  theme: {
    extend: {
      colors: {
        background: colors.base.background,
        foreground: colors.base.foreground,
        brand: colors.brand,
        neutral: colors.neutral,
        accent: colors.accent,
      },
      fontFamily: {
        spaceGrotesk: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
