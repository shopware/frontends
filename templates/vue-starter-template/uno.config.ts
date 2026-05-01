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
      // Extend base colors here
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
            font-family: 'Inter', sans-serif;
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
