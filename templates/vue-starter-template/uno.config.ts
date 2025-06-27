import { type ConfigBase, mergeConfigs } from "@unocss/core";
// jump to the base config to see the presets and rules already applied
import baseConfig from "./.nuxt/uno.config.mjs";

const templateConfig: ConfigBase = {
  // here you can add template-specific configurations
  theme: {
    colors: {
      // "brand-primary": "#123456", // overwrite base color
      // "custom-accent": "#FF00FF", // add a new color
    },
  },
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
