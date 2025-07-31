import type { NuxtConfig } from "@nuxt/schema";
import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  modules: ["@unocss/nuxt"],
  components: [
    {
      path: "./components/public",
      pathPrefix: false,
      // global: true,
    },
    {
      path: "./components/",
      pattern: "Sw*",
      extensions: [".vue"],
      global: false,
    },
  ],
  build: {
    transpile: ["@shopware/cms-base-layer"],
  },
  telemetry: {
    enabled: false,
  },
}) as NuxtConfig;
