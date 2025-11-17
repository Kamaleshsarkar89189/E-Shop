// const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');

const { Roboto, Poppins } = require('next/font/google');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    './src/**/*.{ts,tsx,js,jsx}',
    "./src/app/(routes)/**/*.{js,ts,jsx,tsx}",
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    "./src/app/**/*.{js,ts,jsx,tsx}",   // app folder
    "./src/shared/**/*.{js,ts,jsx,tsx}", // shared folder
    "./src/components/**/*.{js,ts,jsx,tsx}", // components
    //     ...createGlobPatternsForDependencies(__dirname)
  ],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["var(--font-roboto)"],
        Poppins: ["var(--font-poppins)"],
      },
    },
  },
  plugins: [],
};
