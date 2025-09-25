/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'base-dark': '#121212',
        'crimson': '#DC143C',
        'electric-blue': '#00BFFF',
        'send-gradient-from': '#DC143C',
        'send-gradient-to': '#FF4500',
        'notification-red': '#FF2E2E',
        'glass': 'rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'gradient-tech': 'linear-gradient(135deg, #00BFFF 0%, #DC143C 50%, #FF4500 100%)',
        'send-gradient': 'linear-gradient(90deg, #DC143C 0%, #FF4500 100%)',
      },
      fontFamily: {
        'countdown': ['Orbitron', 'monospace'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      borderRadius: {
        'xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
