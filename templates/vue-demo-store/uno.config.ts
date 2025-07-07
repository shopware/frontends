import { helpersCssClasses } from "@shopware/helpers";
import { type ConfigBase, mergeConfigs } from "@unocss/core";
import transformerDirectives from "@unocss/transformer-directives";
// jump to the base config to see the presets and rules already applied
import baseConfig from "./.nuxt/uno.config.mjs";

const templateConfig: ConfigBase = {
  theme: {
    extend: {
      width: "width",
      height: "height",
    },
    // @see https://tailwindcss.com/docs/customizing-colors
    colors: {
      // Brand Primary Colors (with fallbacks)
      primary: "#0d588f",
      "primary-50": "#f0f8ff",
      "primary-100": "#dbeafe",
      "primary-200": "#bfdbfe",
      "primary-300": "#93c5fd",
      "primary-400": "#60a5fa",
      "primary-500": "#3b82f6",
      "primary-600": "#2563eb",
      "primary-700": "#1d4ed8",
      "primary-800": "#1e40af",
      "primary-900": "#1e3a8a",
      "primary-hover": "#0b4f7a",
      "brand-primary": "#0d588f",
      "brand-primary-50": "#f0f8ff",
      "brand-primary-100": "#dbeafe",
      "brand-primary-200": "#bfdbfe",
      "brand-primary-300": "#93c5fd",
      "brand-primary-400": "#60a5fa",
      "brand-primary-500": "#3b82f6",
      "brand-primary-600": "#2563eb",
      "brand-primary-700": "#1d4ed8",
      "brand-primary-800": "#1e40af",
      "brand-primary-900": "#1e3a8a",
      "brand-primary-hover": "#0b4f7a",

      // Brand Secondary Colors (with fallbacks)
      secondary: "#6b7280",
      "secondary-50": "#f9fafb",
      "secondary-100": "#f3f4f6",
      "secondary-200": "#e5e7eb",
      "secondary-300": "#d1d5db",
      "secondary-400": "#9ca3af",
      "secondary-500": "#6b7280",
      "secondary-600": "#475569",
      "secondary-700": "#374151",
      "secondary-800": "#1e293b",
      "secondary-900": "#111827",
      "secondary-hover": "#5a5f66",
      "brand-secondary": "#6b7280",
      "brand-secondary-50": "#f9fafb",
      "brand-secondary-100": "#f3f4f6",
      "brand-secondary-200": "#e5e7eb",
      "brand-secondary-300": "#d1d5db",
      "brand-secondary-400": "#9ca3af",
      "brand-secondary-500": "#6b7280",
      "brand-secondary-600": "#475569",
      "brand-secondary-700": "#374151",
      "brand-secondary-800": "#1e293b",
      "brand-secondary-900": "#111827",
      "brand-secondary-hover": "#5a5f66",
      // Accent Colors
      light: "#5ebbff",
      "light-200": "#e2e8f0",
      dark: "#026ebd",
      white: "#ffffff",

      // Semantic Colors
      indigo: "#6366f1",
      "indigo-50": "#f0f5ff",
      "indigo-500": "#6366f1",
      "indigo-600": "#4f46e5",
      "indigo-700": "#4338ca",

      success: "#22c55e",
      "success-100": "#dcfce7",
      "success-200": "#bbf7d0",
      "success-400": "#4ade80",
      "success-500": "#22c55e",
      "success-600": "#16a34a",
      "success-700": "#15803d",
      "success-800": "#166534",
      "success-900": "#14532d",
      warning: "#eab308",
      "warning-50": "#fefce8",
      "warning-100": "#fef9c3",
      "warning-300": "#fde047",
      "warning-400": "#facc15",
      "warning-500": "#eab308",
      "warning-600": "#ca8a04",
      "warning-700": "#a16207",
      "warning-800": "#854d0e",
      "warning-900": "#713f12",
      // Surface Colors (example for the transformer)
      "surface-surface": "#ffffff",
      "surface-surface-variant": "#f5f5f5",
      "surface-container": "#f0f0f0",
      "surface-container-high": "#e8e8e8",
    },
  },
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
  safelist: helpersCssClasses,
};

export default mergeConfigs([baseConfig, templateConfig]);
