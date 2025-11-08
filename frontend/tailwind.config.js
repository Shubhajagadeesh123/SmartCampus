/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // custom SmartCampus blue
        accent: '#9333ea',  // optional accent
      },
    },
  },
  plugins: [],
}
