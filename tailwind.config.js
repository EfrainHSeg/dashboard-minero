/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 1. Archivo HTML principal
    './index.html',

    // 2. TODOS los archivos dentro de la carpeta 'src'
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};