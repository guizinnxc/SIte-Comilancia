/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Preto profundo: cor principal e fundos
        ink: "#080808",
        // Cinza grafite: superfícies secundárias
        graphite: "#242424",
        // Dourado elegante: títulos, destaques e detalhes
        gold: "#D4AD63",
        // Branco suave: textos e contrastes
        cream: "#F7F4EE",
        // Bege champagne: seções especiais
        champagne: "#E5D3B3",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
        script: ['"Sacramento"', "cursive"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
