// tailwind.config.js
const colors = {
  paper:  "#f6f1da",
  card:   "#fbf6e6",
  border: "#e6dcc4",
  ink:    "#2a261f",
  subtext:"#665e53",
  accent: { DEFAULT:"#c77d54", 600:"#a9653e" },

  // dark
  paperDark:  "#2b2b2b",
  cardDark:   "#3a3a3a",
  borderDark: "#4a4a4a",
  inkDark:    "#d1d1d1",
  subtextDark:"#9a9a9a",
};

module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}","./content/**/*.{md,mdx}"],
  theme: {
    extend: {
      colors,
      fontFamily: { serif: ["Georgia","ui-serif","serif"], sans: ["Inter","ui-sans-serif","system-ui"] },
      maxWidth: { prose: "72ch" },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink'),
            'h1,h2,h3,h4': { color: theme('colors.ink') },
            a: {
              color: theme('colors.accent.DEFAULT'),
              textDecorationThickness: 'from-font',
              textUnderlineOffset: '3px',
              '&:hover': { color: theme('colors.accent.600') },
            },
            blockquote: {
              color: theme('colors.subtext'),
              borderLeftColor: theme('colors.border'),
            },
            hr: { borderColor: theme('colors.border') },
            code: {
              color: theme('colors.ink'),
              backgroundColor: theme('colors.card'),
              padding: '0.15rem 0.35rem',
              borderRadius: '0.375rem',
            },
            'pre code': { backgroundColor: 'transparent', padding: 0 },
            pre: {
              backgroundColor: theme('colors.card'),
              color: theme('colors.ink'),
              border: `1px solid ${theme('colors.border')}`,
              borderRadius: '0.75rem',
            },
            'ul > li::marker': { color: theme('colors.subtext') },
            'ol > li::marker': { color: theme('colors.subtext') },
            figcaption: { color: theme('colors.subtext') },
          },
        },
        invert: {
          css: {
            color: theme('colors.inkDark'),
            'h1,h2,h3,h4': { color: theme('colors.inkDark') },
            a: {
              color: theme('colors.accent.DEFAULT'),
              '&:hover': { color: theme('colors.accent.600') },
            },
            blockquote: {
              color: theme('colors.subtextDark'),
              borderLeftColor: theme('colors.borderDark'),
            },
            hr: { borderColor: theme('colors.borderDark') },
            code: {
              color: theme('colors.inkDark'),
              backgroundColor: theme('colors.cardDark'),
            },
            pre: {
              backgroundColor: theme('colors.cardDark'),
              color: theme('colors.inkDark'),
              border: `1px solid ${theme('colors.borderDark')}`,
            },
            'ul > li::marker': { color: theme('colors.subtextDark') },
            'ol > li::marker': { color: theme('colors.subtextDark') },
            figcaption: { color: theme('colors.subtextDark') },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
