/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C6A15B',
        'primary-dark': '#8A6D3B',
        bg: '#FAF7F2',
        surface: '#FFFFFF',
        text: '#2B2620',
        'text-muted': '#7A7168',
        accent: '#1F4D3D',
        error: '#B3261E',
        success: '#2E7D4F',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
};
