import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  safelist: [
    'text-white',
    'bg-opacity-40',
    'rounded-[30px]',
    'shadow-lg',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-bg': '#EEEEEE',
        'custom-black': '#232931',
        'custom-grey': '#393E46',
        'custom-white': '#232931',
        'primary-green': '#4ECCA3',
        'secondary-green': '#387478',
        'tertiary-green': '#2C5154',
        'color-1': '#E36C59',
        'color-2': '#D87566',
        'color-3': '#DA9540',
        'color-4': '#778BAD',
        'color-5': '#42888D',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
