import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          sage: "var(--wedding-sage)",
          "sage-light": "var(--wedding-sage-light)",
          champagne: "var(--wedding-champagne)",
          graphite: "var(--wedding-graphite)",
          gold: "var(--wedding-gold)",
          background: "var(--background)",
        },
      },
      fontFamily: {
        serif: ["var(--font-heading)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
