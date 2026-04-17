/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#34A593',     // Light teal for '00'
          dark: '#0A4A40',     // Dark green for '52'
          bg: '#F6FAFA',       // Background color
          surface: '#FFFFFF',  // Surface (Sidebar)
          gray: '#8C9896',     // Gray text
        }
      },
      fontFamily: {
        sans: ['MyCustomFont', 'sans-serif'],
        // sans: ['Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
