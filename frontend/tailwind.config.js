/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ini penting biar Tailwind scan semua file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
