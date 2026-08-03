import { fileURLToPath } from "node:url";

import baseConfig from "@shopware/unocss-design-tokens-layer/uno.config";
import { type ConfigBase, mergeConfigs } from "@unocss/core";
import { presetAttributify, presetTypography } from "unocss";

const templateRoot = fileURLToPath(new URL(".", import.meta.url));

const templateConfig: ConfigBase = {
  // here you can add template-specific configurations
  content: {
    filesystem: [`${templateRoot}/app/**/*.{ts,vue}`],
  },
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
  // The base design-token layer provides presetWind3 and presetIcons.
  presets: [presetAttributify(), presetTypography()],
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
