import { defineNuxtConfig } from "nuxt/config";

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
});
