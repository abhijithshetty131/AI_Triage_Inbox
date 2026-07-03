/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'priority-p1': '#dc2626',
        'priority-p2': '#ea580c',
        'priority-p3': '#16a34a',
      },
    },
  },
  plugins: [],
}
