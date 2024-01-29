import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  theme: {
    extend: {
      width: "width",
      height: "height",
    },
    // @see https://tailwindcss.com/docs/customizing-colors
    colors: {
      primary: {
        DEFAULT: "#0d588f",
        100: "#dbeafe",
        200: "#bfdbfe",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
      },
      secondary: {
        DEFAULT: "#6b7280",
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#475569",
        700: "#374151",
        800: "#1e293b",
        900: "#111827",
      },
      light: {
        DEFAULT: "#5ebbff",
        200: "#e2e8f0",
      },
      dark: {
        DEFAULT: "#026ebd",
      },
      white: {
        DEFAULT: "#ffffff",
      },
      indigo: {
        DEFAULT: "#6366f1",
        50: "#f0f5ff",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
      },
      green: {
        DEFAULT: "#22c55e",
        100: "#dcfce7",
        200: "#bbf7d0",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
      },
      yellow: {
        DEFAULT: "#eab308",
        50: "#fefce8",
        300: "#fde047",
      },
    },
  },
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  transformers: [transformerDirectives()],
  preflights: [
    // preflights can be used to set some base styles
    {
      getCSS: () => `
      h1 {
        line-height: 2.5rem;
        font-size: 2.25rem;
      }
      h2 {
        line-height: 2rem;
        font-size: 1.75rem;
      }
      h3 {
        line-height: 1.5rem;
        font-size: 1.25rem;
      }
      ol,
      ul,
      dl {
        list-style-type: disc;
        padding-left: 40px;
        margin-top: 0;
        margin-bottom: 1rem;
      }
      ol {
        list-style-type: decimal;
      }
      `,
    },
  ],
  safelist: ["max-md:hidden", "md:max-lg:hidden", "lg:hidden"],
});
