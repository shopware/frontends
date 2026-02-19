import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
} from "unocss";

export default defineConfig({
  shortcuts: {},
  preflights: [
    {
      getCSS: () => `
        /* Filter collapse transition */
        .filter-collapse-enter-active,
        .filter-collapse-leave-active {
          transition: all 0.3s ease-in-out;
          overflow: hidden;
        }

        .filter-collapse-enter-from,
        .filter-collapse-leave-to {
          max-height: 0;
          opacity: 0;
        }

        .filter-collapse-enter-to,
        .filter-collapse-leave-from {
          max-height: 1000px;
          opacity: 1;
        }
      `,
    },
  ],
  theme: {
    colors: {
      "brand-primary": "#543B95",
      "surface-surface": "#FFFFFF",
      "outline-outline": "#79747E",
      "outline-outline-variant": "#CAC4D0",
      "outline-outline-primary": "#543B95",
      "surface-on-surface": "#1D1B20",
      "surface-surface-variant": "#FBF6FF",
      "states-success": "#15B31C",
      "surface-on-surface-variant": "#696470",
      "surface-surface-disabled": "#E8E8E8",
      "surface-on-surface-disabled": "#9893A6",
      "surface-surface-primary": "#D0BCFF",
      "states-warning": "#F57C00",
      "surface-surface-container": "#F3EDF7",
      "surface-surface-container-highest": "#E6E0E9",
      "states-error": "#D12D24",
      "states-on-error": "#FFFFFF",
      "brand-primary-hover": "#45317A",
      "brand-on-primary": "#FFFFFF",
      "brand-secondary": "#E1D5FF",
      "brand-secondary-hover": "#D0BCFC",
      "brand-on-secondary": "#3A276A",
      "brand-tertiary": "#F1F1F1",
      "brand-tertiary-hover": "#E3E3E3",
      "brand-on-tertiary": "#1D1B20",
      "other-sale": "#D12D24",
      "overlay-dark-highest": "rgba(0, 0, 0, 0.75)",
      "overlay-dark-high": "rgba(0, 0, 0, 0.5)",
      "overlay-dark": "rgba(0, 0, 0, 0.3)",
      "overlay-dark-low": "rgba(0, 0, 0, 0.12)",
      "overlay-dark-lowest": "rgba(0, 0, 0, 0.08)",
      "overlay-light-highest": "rgba(255, 255, 255, 0.75)",
      "overlay-light-high": "rgba(255, 255, 255, 0.5)",
      "overlay-light": "rgba(255, 255, 255, 0.25)",
      "overlay-light-low": "rgba(255, 255, 255, 0.12)",
      "overlay-light-lowest": "rgba(255, 255, 255, 0.08)",
      "fixed-fixed-on-image": "#FFFFFF",
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
