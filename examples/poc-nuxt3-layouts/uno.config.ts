import { mergeConfigs } from "@unocss/core";
import config from "./.nuxt/uno.config.mjs";

console.log("config", config);
export default mergeConfigs([
  {
    // Base config
  },
  config,
]);
