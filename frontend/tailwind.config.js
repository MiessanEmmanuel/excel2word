/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1e2531",
        "primary-hover": "#263550",
        "secondary": "#3d8547",
        "secondary-hover": "#25522b",
        "tertiary": "#d1c9ba",
        "tertiary-back": "#d1c9ba",
        "tertiary-fonce": "#817b70"
      }
    }
  },
  plugins: [],
}
