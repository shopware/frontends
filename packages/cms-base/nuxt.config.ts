import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "@nuxt/schema";
export default defineNuxtConfig({
  components: [
    {
      path: "./components/public",
      pathPrefix: false,
      // global: true,
    },
  ],
  build: {
    transpile: ["@shopware-pwa/cms-base"],
  },
  telemetry: false,
}) as NuxtConfig;
