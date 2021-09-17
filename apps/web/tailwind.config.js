const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        trueGray: colors.trueGray,
      },
      fontFamily: {
        sans: ['"EB Garamond"'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
