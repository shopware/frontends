import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  telemetry: {
    enabled: false,
  },
  modules: ["@unocss/nuxt"],
  css: ["@unocss/reset/tailwind-compat.css"],
  unocss: {
    nuxtLayers: true,
  },
});
