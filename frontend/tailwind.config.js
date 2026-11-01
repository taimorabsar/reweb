/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Navy: trust, stability. Used for links, headings, focus rings, navigation.
        primary: {
          50: "#eef3fa",
          100: "#dce6f5",
          200: "#b9cce8",
          300: "#8faad1",
          400: "#5e80b1",
          500: "#3a5e96",
          600: "#1b3a6b",
          700: "#12284c",
          800: "#0d1f3c",
          900: "#091529",
        },
        // Burnt orange: the main call-to-action color (Search, Contact, Post property).
        accent: {
          50: "#fff1ec",
          100: "#ffdfd3",
          200: "#ffbfa6",
          300: "#ff8a65",
          400: "#e8663f",
          500: "#d9501f",
          600: "#c93f18",
          700: "#a93313",
          800: "#872a12",
          900: "#6b2210",
        },
        // Green: only for "Verified agent / Verified owner" badges.
        verified: {
          50: "#e8f5ee",
          100: "#cfebdb",
          600: "#1e7a4d",
          700: "#176240",
          800: "#124d33",
        },
      },
    },
  },
  plugins: [],
};