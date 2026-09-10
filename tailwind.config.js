/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0F0C0A",
        pulp: "#1A1410",
        peel: "#2A221C",
        berry: "#FF4D6D",
        mango: "#FFB020",
        lime: "#C8F542",
        cream: "#FFF6EB",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "36px",
      },
      boxShadow: {
        glow: "0 16px 48px rgba(255, 77, 109, 0.18)",
      },
    },
  },
  plugins: [],
};
