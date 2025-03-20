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
      "brand-primary": "#D0BCFE",
      "surface-surface": "#141218",
      "outline-outline": "#938F99",
      "outline-outline-variant": "#49454F",
      "outline-outline-primary": "#D0BCFE",
      "outline-outline-disabled": "#A19AA5",
      "outline-outline-focus": "#1722F9",
      "surface-on-surface": "#FFFFFF",
      "states-info": "#99DAFE",
      "states-info-hover": "#8AC2E1",
      "states-info-pressed": "#8AC2E1",
      "states-on-info": "#013957",
      "states-info-container": "#013957",
      "states-on-info-container": "#BBE7FF",
      "surface-surface-variant": "#49454F",
      "states-success": "#BAF2BD",
      "states-success-hover": "#77BA7A",
      "surface-on-surface-variant": "#CAC4D0",
      "surface-surface-disabled": "#4D4850",
      "states-success-pressed": "#77BA7A",
      "surface-on-surface-disabled": "#A19AA5",
    },
    spacing: {
      "device-width": "1200px",
      scale: "1px",
      "root-font-size": "16px",
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
