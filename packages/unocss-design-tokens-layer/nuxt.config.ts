import type { NuxtConfig } from "@nuxt/schema";
import { defineNuxtConfig } from "nuxt/config";

const config: NuxtConfig = defineNuxtConfig({
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
