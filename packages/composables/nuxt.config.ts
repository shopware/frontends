import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  imports: {
    dirs: ["src"],
  },
  build: {
    transpile: ["@shopware-pwa/composables-next"],
  },
  telemetry: {
    enabled: false,
  },
});
