import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        "emerson.run": {
          "primary": "#0068ff",
          "primary-content": "#ffffff",

          "secondary": "#6f9600",
          "secondary-content": "#ffffff",

          "accent": "#007200",
          "accent-content": "#ffffff",

          "neutral": "#003335",
          "neutral-content": "#ffffff",

          "base-100": "#000000",
          "base-200": "#1a1a1a",
          "base-300": "#333333",
          "base-content": "#ffffff",

          "info": "#00e3ff",
          "info-content": "#000000",

          "success": "#1cb024",
          "success-content": "#000000",

          "warning": "#fab000",
          "warning-content": "#000000",

          "error": "#ff4c57",
          "error-content": "#000000"
        },
      },
    ],
  },
};
