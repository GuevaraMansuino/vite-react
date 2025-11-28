/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Necesarios para shadcn
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Tus colores personalizados
        neon: {
          green: "#22c55e",
          emerald: "#10b981",
          lime: "#84cc16",
        },
      },

      boxShadow: {
        "neon-sm": "0 0 10px rgba(34, 197, 94, 0.3)",
        neon: "0 0 20px rgba(34, 197, 94, 0.5)",
        "neon-lg": "0 0 30px rgba(34, 197, 94, 0.7)",
      },

      animation: {
        slideIn: "slideIn 0.3s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },

      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
