/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        'poppins-extra-light': ['var(--font-poppins-extra-light)'],
        'poppins-light': ['var(--font-poppins-light)'],
        'poppins-rg': ['var(--font-poppins-rg)'],
        'poppins-md': ['var(--font-poppins-md)'],
        'poppins-sb': ['var(--font-poppins-sb)'],
        'poppins-black': ['var(--font-poppins-black)'],
        'poppins-bold': ['var(--font-poppins-bold)']
      }
    }
  },
  plugins: []
}

export default config
