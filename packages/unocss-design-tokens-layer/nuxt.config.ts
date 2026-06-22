import { defineNuxtConfig } from "nuxt/config";

const config: ReturnType<typeof defineNuxtConfig> = defineNuxtConfig({
  telemetry: {
    enabled: false,
  },
  modules: ["@unocss/nuxt"],
  css: ["@unocss/reset/tailwind-compat.css"],
  unocss: {
    nuxtLayers: true,
  },
});

export default config;
