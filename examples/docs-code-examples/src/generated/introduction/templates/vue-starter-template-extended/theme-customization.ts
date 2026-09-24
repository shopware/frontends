// uno.config.ts
import { mergeConfigs } from "@unocss/core";

import baseConfig from "./.nuxt/uno.config.mjs";

export default mergeConfigs([
  baseConfig,
  {
    theme: {
      colors: {
        "brand-primary": "#B38A65",
        "brand-secondary": "#2C2C2C",
      },
    },
  },
]);
