/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
      "./**/*.{js,ts,jsx,tsx}",
      // "./src/**/*.{js,ts,jsx,tsx}",
      // "./components/**/*.{js,ts,jsx,tsx}",
      // "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "hsl(var(--bg-main) / <alpha-value>)",
          primary: "hsl(var(--bg-primary))",
          danger: "hsl(var(--bg-danger))",
          'splash-screen': "hsl(var(--bg-splash-screen))",
          'bg-100': "hsl(var(--bg-100))",
          'bg-200': "hsl(var(--bg-200))",

          'clr-100': "hsl(var(--text-clr-100))",
          'clr-200': "hsl(var(--text-clr-200))",
          'clr-300': "hsl(var(--text-clr-300))",

          'initial-clr': "hsl(var(--initial-clr))",
          
          'border-clr': "hsl(var(--border-clr))",
          card: "hsl(var(--card))",
          debugpink: "#ff00ff",
        },
        borderRadius: {
          xl: "1rem",
        },
        fontSize: {
          "big-initial": "var(--big-initial)",
          "small-initial": "var(--small-initial)",
          
          "heading-100": "var(--heading-100)",
          "heading-200": "var(--heading-200)",
          "heading-300": "var(--heading-300)",
      
          "text-100": "var(--text-100)",
          "text-200": "var(--text-200)",
          "text-300": "var(--text-300)",
        },
      },
    },
    plugins: [],
  };
  