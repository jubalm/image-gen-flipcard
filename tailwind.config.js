/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom animation now handled in globals.css with @theme, so these are removed
    },
  },
  plugins: [],
};
