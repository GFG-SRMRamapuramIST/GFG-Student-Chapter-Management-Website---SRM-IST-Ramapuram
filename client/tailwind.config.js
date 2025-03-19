/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'gfgsc-green': "#00895e",
        'gfgsc-blue': "#002b46",
        'gfgsc-red': "#890000",
        'gfgsc-green-200': "#b3e6d4",
        'gfgsc-green-400': "#66c7a4",
        'gfg-green': '#2f8d46',
        'gfg-black': '#1f1f1f',
        'gfg-white': '#f1f1f1',
        'hover-gray': '#f7f9fa',
      },
    },
  },
  plugins: [],
};
