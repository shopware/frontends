import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
} from "unocss";

export default defineConfig({
  theme: {
    colors: {
      "brand-primary": "#543B95",
      "surface-surface": "#FFFFFF",
      "outline-outline": "#79747E",
      "outline-outline-variant": "#CAC4D0",
      "outline-outline-primary": "#543B95",
      "outline-outline-disabled": "#9893A6",
      "outline-outline-focus": "#1722F9",
      "surface-on-surface": "#1D1B20",
      "states-info": "#0288D1",
      "states-info-hover": "#0275B4",
      "states-info-pressed": "#0275B4",
      "states-on-info": "#FFFFFF",
      "states-info-container": "#BBE7FF",
      "states-on-info-container": "#013957",
      "surface-surface-variant": "#FBF6FF",
      "states-success": "#15B31C",
      "states-success-hover": "#108C16",
      "surface-on-surface-variant": "#696470",
      "surface-surface-disabled": "#E8E8E8",
      "states-success-pressed": "#108C16",
      "surface-on-surface-disabled": "#9893A6",
    },
    spacing: {
      "font-size-scale-01": "12px",
      "font-size-scale-02": "14px",
      "font-size-scale-03": "16px",
      "font-size-scale-04": "20px",
      "font-size-scale-05": "24px",
      "font-size-scale-06": "32px",
      "font-size-scale-07": "40px",
      "font-size-scale-08": "48px",
      "font-size-scale-09": "64px",
      "font-size-scale-10": "72px",
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Noto Serif", "serif"],
    },
  },
  presets: [
    presetWind3(),
    presetIcons({
      collections: {
        carbon: () =>
          import("@iconify-json/carbon/icons.json").then((i) => i.default),
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
  preflights: [
    {
      getCSS: () => `
      body {
        font-family: 'Inter', sans-serif;
      }
      `,
    },
  ],
});
