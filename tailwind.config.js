module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-in-left": "slide-in-left 150ms ease-out",
        "slide-out-left": "slide-out-left 150ms ease-out",
      },
      keyframes: {
        "slide-in-left": {
          "0%": { transform: "translateX(-6rem)", opacity: "0" },
          "100%": { transform: "translateX(0rem)", opacity: "1" },
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0rem)", opacity: "1" },
          "100%": { transform: "translateX(-6rem)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
