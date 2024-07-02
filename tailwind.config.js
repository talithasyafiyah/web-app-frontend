/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#00A8D0",
        darkprimary: "#0086A6",
        secondary: "#FFB423",
        darksecondary: "#CC901C",
        main: "#2D2D2D",
        danger: "#F93939",
        gray: "#8F8F8F",
        darkgray: "#606060",
        neutral: "#BFBFBF",
        background: "#F7FCFE",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-down": {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(100%)", opacity: 0 },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
      },
    },
  },
  variants: {
    extend: {
      scrollbar: ["rounded"],
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "100%",
          paddingLeft: "16px",
          paddingRight: "16px",
          "@screen sm": {
            maxWidth: "425px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "0",
            paddingRight: "0",
          },
          "@screen md": {
            maxWidth: "700px",
          },
          "@screen lg": {
            maxWidth: "920px",
          },
          "@screen xl": {
            maxWidth: "1120px",
          },
          "@screen 2xl": {
            maxWidth: "1440px",
          },
          ".swap-button": {
            position: "absolute",
            top: "50px" /* Adjust this value as needed */,
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#f0f0f0",
            borderRadius: "50%",
            padding: "10px",
            cursor: "pointer",
            zIndex: "10",
          },
          ".modal": {
            position: "absolute",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px",
            width: "100%",
          },

          ".overlay": {
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "50",
          },

          ".blur-background": {
            filter: "blur(5px)" /* Adjust the blur radius as needed */,
          },

          ".overlayLoad": {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background:
              "rgba(255, 255, 255, 0.8)" /* Semi-transparent background */,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999" /* Make sure it's on top */,
          },

          ".ticket-container": {
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            fontFamily: "Arial, sans-serif",
            width: "600px",
            margin: "auto",
          },
          ".header": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
            paddingBottom: "8px",
            marginBottom: "16px",
          },
          ".title": {
            fontSize: "24px",
            fontWeight: "bold",
          },
          ".order-id": {
            fontSize: "14px",
            color: "#777",
          },
          ".flight-info .section": {
            marginBottom: "16px",
          },
          ".section-title": {
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "8px",
          },
          ".flight-detail .flight": {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          },
          ".flight .airline": {
            fontWeight: "bold",
          },
          ".flight .flight-number, .flight .departure-time, .flight .departure-city, .flight .arrival-time, .flight .arrival-city":
            {
              marginLeft: "8px",
            },
          ".passenger": {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          },
        },
      });
    }),
    require("tailwind-scrollbar"),
  ],
};
