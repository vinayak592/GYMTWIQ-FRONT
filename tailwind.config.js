/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gymDark: "#0D0F0E",
        gymDarkSecondary: "#151817",
        gymSurface: "#1C201E",
        gymCard: "#232826",
        gymCardElevated: "#2A302D",
        gymBorder: "#3A403D",
        gymTextPrimary: "#F2F4F3",
        gymTextSecondary: "#A7AEAA",
        gymTextMuted: "#737A76",
        gymOrange: "#FF6A00",
        gymOrangeBright: "#FF7A00",
        gymOrangeDark: "#C94F00",
        gymOrangeSoft: "#FF9A4D",
        gymOrangeGlow: "rgba(255,106,0,0.20)",
        gymSuccess: "#45C486",
        gymWarning: "#FFB020",
        gymError: "#EF5350",
        gymInfo: "#5DADE2",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        '3d-pop': '0 10px 30px rgba(0, 0, 0, 0.35)',
        '3d-hover': '0 15px 35px rgba(0, 0, 0, 0.45), 0 0 20px rgba(255, 106, 0, 0.15)',
        'orange-glow': '0 0 25px rgba(255, 106, 0, 0.25)',
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
      }
    },
  },
  plugins: [],
}
