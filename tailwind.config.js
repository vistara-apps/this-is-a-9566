/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 70%, 50%)',
        accent: 'hsl(160, 70%, 45%)',
        background: 'hsl(220, 20%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        'text-primary': 'hsl(220, 20%, 15%)',
        'text-secondary': 'hsl(220, 20%, 40%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(220, 20%, 15%, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}