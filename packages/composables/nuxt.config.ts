import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  imports: {
    dirs: ["src"],
  },
  build: {
    transpile: ["@shopware/composables"],
  },
  vite: {
    build: {
      rolldownOptions: {
        checks: {
          invalidAnnotation: false,
          pluginTimings: false,
        },
      },
    },
  },
  telemetry: {
    enabled: false,
  },
}) as NuxtConfig;
