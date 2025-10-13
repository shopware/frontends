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
      "surface-on-surface": "#1D1B20",
      "surface-surface-variant": "#FBF6FF",
      "states-success": "#15B31C",
      "surface-on-surface-variant": "#696470",
      "surface-surface-disabled": "#E8E8E8",
      "surface-surface-container-highest": "#E6E0E9",
      "states-error": "#D12D24",
      "states-on-error": "#FFFFFF",
      "brand-primary-pressed": "#45317A",
      "brand-on-primary": "#FFFFFF",
      "brand-secondary": "#E1D5FF",
      "brand-secondary-hover": "#D0BCFC",
      "brand-secondary-pressed": "#D0BCFC",
      "brand-on-secondary": "#3A276A",
      "brand-tertiary": "#F1F1F1",
      "brand-tertiary-hover": "#E3E3E3",
      "brand-tertiary-pressed": "#E3E3E3",
      "brand-on-tertiary": "#1D1B20",
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
          import("@iconify-json/carbon/icons.json", {
            with: { type: "json" },
          }).then((i) => i.default),
      },
    }),
    presetAttributify(),
    presetTypography(),
  ],
});
