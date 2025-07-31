import { type ConfigBase, mergeConfigs } from "@unocss/core";
import {
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
} from "unocss";
// jump to the base config to see the presets and rules already applied
import baseConfig from "./.nuxt/uno.config.mjs";

const templateConfig: ConfigBase = {
  // here you can add template-specific configurations
  theme: {
    colors: {
      // "brand-primary": "#123456", // overwrite base color
      // "custom-accent": "#FF00FF", // add a new color
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
      "states-on-success": "#FFFFFF",
      "surface-surface-primary": "#D0BCFF",
      "surface-on-surface-primary": "#3A276A",
      "surface-inverse-surface": "#322F35",
      "states-success-container": "#C9FFCB",
      "states-on-success-container": "#09480C",
      "surface-inverse-on-surface": "#FFFFFF",
      "states-warning": "#F57C00",
      "states-warning-hover": "#C26200",
      "surface-surface-container-lowest": "#FFFFFF",
      "states-warning-pressed": "#C26200",
      "surface-surface-container-low": "#F7F2FA",
      "surface-surface-container": "#F3EDF7",
      "states-on-warning": "#FFFFFF",
      "states-warning-container": "#FFE1C2",
      "surface-surface-container-high": "#ECE6F0",
      "states-on-warning-container": "#874400",
      "surface-surface-container-highest": "#E6E0E9",
      "surface-background": "#FFFFFF",
      "surface-on-background": "#1D1B20",
      "states-error": "#D12D24",
      "states-error-hover": "#AB251D",
      "states-error-pressed": "#AB251D",
      "states-on-error": "#FFFFFF",
      "states-error-container": "#F9DEDC",
      "states-on-error-container": "#852221",
      "brand-primary-hover": "#45317A",
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
      "fixed-fixed-on-image": "#FFFFFF",
      "other-sale": "#D12D24",
      "other-shadow": "#000000",
      "opacity-opacity-dark-highest": "rgba(0, 0, 0, 0.75)",
      "opacity-opacity-dark-high": "rgba(0, 0, 0, 0.5)",
      "opacity-opacity-dark": "rgba(0, 0, 0, 0.30000001192092896)",
      "opacity-opacity-dark-low": "rgba(0, 0, 0, 0.11999999731779099)",
      "opacity-opacity-dark-lowest": "rgba(0, 0, 0, 0.07999999821186066)",
      "opacity-opacity-light-highest": "rgba(255, 255, 255, 0.75)",
      "opacity-opacity-light-high": "rgba(255, 255, 255, 0.5)",
      "opacity-opacity-light": "rgba(255, 255, 255, 0.25)",
      "opacity-opacity-light-low": "rgba(255, 255, 255, 0.11999999731779099)",
      "opacity-opacity-light-lowest":
        "rgba(255, 255, 255, 0.07999999821186066)",
    },
    fontFamily: {
      inter: "Inter",
      Noto_Serif: "Noto Serif",
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
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased; 
        }
        `,
    },
  ],
  // and more...
};

export default mergeConfigs([baseConfig, templateConfig]);
