import { type ConfigBase, mergeConfigs } from "@unocss/core";
import {
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
} from "unocss";
import baseConfig from "./.nuxt/uno.config.mjs";

const templateConfig: ConfigBase = {
  // here you can add template-specific configurations
  safelist: [
    // commonly CMS-provided classes not present in source — safelisted to reduce layout shift
    "bg-overlay-dark-high",
    "justify-self-start",
    "leading-8",
    "max-w-[872px]",
    "max-w-[984px]",
    "md:text-7xl",
    "min-h-[420px]",
    "min-h-[800px]",
    "text-fixed-fixed-on-image",
  ],
  theme: {
    colors: {
      // "brand-primary": "var(--color-custom)", // overwrite base color via CSS variable
      // "custom-accent": "var(--color-custom-accent)", // add a new color via CSS variable
      "brand-primary": "var(--color-brand-primary)",
      "brand-primary-hover": "var(--color-brand-primary-hover)",
      "brand-primary-pressed": "var(--color-brand-primary-pressed)",
      "brand-on-primary": "var(--color-brand-on-primary)",
      "brand-secondary": "var(--color-brand-secondary)",
      "brand-secondary-hover": "var(--color-brand-secondary-hover)",
      "brand-secondary-pressed": "var(--color-brand-secondary-pressed)",
      "brand-on-secondary": "var(--color-brand-on-secondary)",
      "brand-tertiary": "var(--color-brand-tertiary)",
      "brand-tertiary-hover": "var(--color-brand-tertiary-hover)",
      "brand-tertiary-pressed": "var(--color-brand-tertiary-pressed)",
      "brand-on-tertiary": "var(--color-brand-on-tertiary)",
      "surface-surface": "var(--color-surface-surface)",
      "surface-surface-variant": "var(--color-surface-surface-variant)",
      "surface-surface-disabled": "var(--color-surface-surface-disabled)",
      "surface-surface-primary": "var(--color-surface-surface-primary)",
      "surface-surface-container-lowest":
        "var(--color-surface-surface-container-lowest)",
      "surface-surface-container-low":
        "var(--color-surface-surface-container-low)",
      "surface-surface-container": "var(--color-surface-surface-container)",
      "surface-surface-container-high":
        "var(--color-surface-surface-container-high)",
      "surface-surface-container-highest":
        "var(--color-surface-surface-container-highest)",
      "surface-on-surface": "var(--color-surface-on-surface)",
      "surface-on-surface-variant": "var(--color-surface-on-surface-variant)",
      "surface-on-surface-disabled": "var(--color-surface-on-surface-disabled)",
      "surface-on-surface-primary": "var(--color-surface-on-surface-primary)",
      "surface-inverse-surface": "var(--color-surface-inverse-surface)",
      "surface-inverse-on-surface": "var(--color-surface-inverse-on-surface)",
      "surface-background": "var(--color-surface-background)",
      "surface-on-background": "var(--color-surface-on-background)",
      "outline-outline": "var(--color-outline-outline)",
      "outline-outline-variant": "var(--color-outline-outline-variant)",
      "outline-outline-primary": "var(--color-outline-outline-primary)",
      "outline-outline-disabled": "var(--color-outline-outline-disabled)",
      "outline-outline-focus": "var(--color-outline-outline-focus)",
      "states-info": "var(--color-states-info)",
      "states-info-hover": "var(--color-states-info-hover)",
      "states-info-pressed": "var(--color-states-info-pressed)",
      "states-on-info": "var(--color-states-on-info)",
      "states-info-container": "var(--color-states-info-container)",
      "states-on-info-container": "var(--color-states-on-info-container)",
      "states-success": "var(--color-states-success)",
      "states-success-hover": "var(--color-states-success-hover)",
      "states-success-pressed": "var(--color-states-success-pressed)",
      "states-on-success": "var(--color-states-on-success)",
      "states-success-container": "var(--color-states-success-container)",
      "states-on-success-container": "var(--color-states-on-success-container)",
      "states-warning": "var(--color-states-warning)",
      "states-warning-hover": "var(--color-states-warning-hover)",
      "states-warning-pressed": "var(--color-states-warning-pressed)",
      "states-on-warning": "var(--color-states-on-warning)",
      "states-warning-container": "var(--color-states-warning-container)",
      "states-on-warning-container": "var(--color-states-on-warning-container)",
      "states-error": "var(--color-states-error)",
      "states-error-hover": "var(--color-states-error-hover)",
      "states-error-pressed": "var(--color-states-error-pressed)",
      "states-on-error": "var(--color-states-on-error)",
      "states-error-container": "var(--color-states-error-container)",
      "states-on-error-container": "var(--color-states-on-error-container)",
      "fixed-fixed-on-image": "var(--color-fixed-fixed-on-image)",
      "other-sale": "var(--color-other-sale)",
      "other-shadow": "var(--color-other-shadow)",
      "overlay-dark-highest": "var(--color-overlay-dark-highest)",
      "overlay-dark-high": "var(--color-overlay-dark-high)",
      "overlay-dark": "var(--color-overlay-dark)",
      "overlay-dark-low": "var(--color-overlay-dark-low)",
      "overlay-dark-lowest": "var(--color-overlay-dark-lowest)",
      "overlay-light-highest": "var(--color-overlay-light-highest)",
      "overlay-light-high": "var(--color-overlay-light-high)",
      "overlay-light": "var(--color-overlay-light)",
      "overlay-light-low": "var(--color-overlay-light-low)",
      "overlay-light-lowest": "var(--color-overlay-light-lowest)",
    },
    fontFamily: {
      inter: "var(--font-inter)",
      Noto_Serif: "var(--font-noto-serif)",
    },
  },
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
  preflights: [
    {
      getCSS: () => `
        body {
            font-family: var(--font-inter);
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased; 
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #fff inset;
          box-shadow: 0 0 0px 1000px #fff inset;
          color: #fff;
        }
        `,
    },
  ],
};

export default mergeConfigs([baseConfig, templateConfig]);
