/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  future: { hoverOnlyWhenSupported: true },
  content: [
    './index.html',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: { extend: {
      colors: {
        primary: "#050816",
        secondary: "#ffffff",
        tertiary: "#2a43ef",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      rotate: {
        'y-180': '180deg',
      },
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
    },
  },
  plugins: [], 
};
