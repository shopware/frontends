import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "@nuxt/schema";
export default defineNuxtConfig({
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
    transpile: ["@shopware-pwa/cms-base"],
  },
  telemetry: false,
}) as NuxtConfig;
