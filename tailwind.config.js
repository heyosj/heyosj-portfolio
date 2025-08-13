/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}","./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors: {
        paper:  "#f6f1da",
        card:   "#fbf6e6",
        border: "#e6dcc4",
        ink:    "#2a261f",
        subtext:"#665e53",
        accent: { DEFAULT:"#c77d54", 600:"#a9653e" }
      },
      fontFamily: { serif: ["Georgia","ui-serif","serif"], sans: ["Inter","ui-sans-serif","system-ui"] },
      maxWidth: { prose: "72ch" }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
