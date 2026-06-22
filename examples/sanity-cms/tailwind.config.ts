import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

// Vibrant & playful theme: gradients, rounded cards, soft shadows, motion.
// @nuxtjs/tailwindcss injects the `content` globs automatically.
export default {
  theme: {
    extend: {
      fontFamily: {
        display: [
          "'Plus Jakarta Sans'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgb(15 23 42 / 0.15)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 7s ease-in-out infinite",
        "gradient-pan": "gradient-pan 9s ease infinite",
      },
    },
  },
  plugins: [typography],
} satisfies Partial<Config>;
