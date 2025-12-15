import { type ConfigBase, mergeConfigs } from "@unocss/core";
import baseConfig from "../vue-starter-template/.nuxt/uno.config.mjs";

const lumoraConfig: ConfigBase = {
  theme: {
    colors: {
      // LUMORA BRAND PALETTE
      "brand-primary": "#B38A65",
      "brand-primary-hover": "#9E7756",
      "brand-primary-pressed": "#8A6648",
      "brand-on-primary": "#FFFFFF",

      "brand-secondary": "#E8DCC7",
      "brand-secondary-hover": "#E1D1B4",
      "brand-secondary-pressed": "#D7C6A7",
      "brand-on-secondary": "#3D382F",

      "brand-tertiary": "#F4EFE7",
      "brand-on-tertiary": "#3D382F",

      // Neutral palette for backgrounds & text
      "neutral-dark": "#3D382F", // headings
      neutral: "#6E675B", // body text
      "neutral-light": "#D5CEC4", // soft dividers

      // Accent
      "accent-olive": "#8E8A6A",

      // Surfaces (aligned with Shopware design language)
      "surface-surface": "#FFFFFF",
      "surface-background": "#FFFFFF",
      "surface-surface-primary": "#EDE6DE",
      "surface-surface-container": "#F4EFE7",
      "surface-surface-container-low": "#F7F3EC",
      "surface-surface-variant": "#EAE4DA",
      "surface-on-surface": "#3D382F",
      "surface-on-surface-variant": "#6E675B",
      "surface-inverse-surface": "#3D382F",
      "surface-inverse-on-surface": "#FFFFFF",

      // Standard semantic colors — unchanged
      "states-info": "#0288D1",
      "states-success": "#15B31C",
      "states-warning": "#F57C00",
      "states-error": "#D12D24",
    },

    fontFamily: {
      inter: "Inter",
      Noto_Serif: "Noto Serif",
    },
  },

  shortcuts: [
    [
      "lumora-separator",
      "w-full h-[1px] my-12 bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.1)]",
    ],
  ],

  preflights: [
    {
      getCSS: () => `
        body {
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1 {
          font-size: 2.25rem;
          line-height: 2.5rem;
          font-weight: 700;
        }
        h2 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 600;
        }
        h3 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
        }
      `,
    },
  ],
};

export default mergeConfigs([baseConfig, lumoraConfig]);
