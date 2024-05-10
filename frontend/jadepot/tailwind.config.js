/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        text1: 'var(--text1)',
        background1: 'var(--background1)',
        primary1: 'var(--primary1)',
        secondary1: 'var(--secondary1)',
        accent1: 'var(--accent1)',
        blue1: 'var(--blue1)',
        background2: 'var(--background2)',
       },       
       
      fontFamily: {
        'nunito': ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}