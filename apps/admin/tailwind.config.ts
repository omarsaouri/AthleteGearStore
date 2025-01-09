import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#a1cca5",
        "primary-content": "#27472a",
        "primary-dark": "#80ba85",
        "primary-light": "#c2dec5",

        secondary: "#aca1cc",
        "secondary-content": "#2f2747",
        "secondary-dark": "#8f80ba",
        "secondary-light": "#c9c2de",

        background: "#181b18",
        foreground: "#232924",
        border: "#3b453c",

        copy: "#fbfbfb",
        "copy-light": "#d6dcd6",
        "copy-lighter": "#9faca0",

        success: "#a1cca1",
        warning: "#cccca1",
        error: "#cca1a1",

        "success-content": "#274727",
        "warning-content": "#474727",
        "error-content": "#472727",
      },
    },
  },
  plugins: [],
} satisfies Config;
