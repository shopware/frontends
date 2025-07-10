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
      "surface-on-surface": "#1D1B20",
      "states-success": "#15B31C",
      "states-error": "#D12D24",
      "brand-primary-hover": "#45317A",
      "brand-secondary": "#E1D5FF",
      "brand-secondary-hover": "#D0BCFC",
      "brand-tertiary-hover": "#E3E3E3",
    },
    fontFamily: {
      inter: "Inter",
      Noto_Serif: "Noto Serif",
    },
  },
  safelist: ["states-success", "states-error", "states-info", "states-warning"],
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
});
