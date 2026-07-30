/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        canvas: "#FFF9F7",
        ink: "#281D1A",
        muted: "#735F59",
        brand: { DEFAULT: "#8B2942", soft: "#F5DDE4" },
        border: "#E8D9D4",
      },
      borderRadius: { card: "20px" },
    },
  },
  plugins: [],
};
