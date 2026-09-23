import { mergeConfigs } from "@unocss/core";
import baseConfig from "./.nuxt/uno.config.mjs";

export default mergeConfigs([
  baseConfig,
  {
    theme: {
      colors: {
        "brand-primary": "#your-brand-color",
        "brand-secondary": "#your-secondary-color",
      },
    },
  },
]);
