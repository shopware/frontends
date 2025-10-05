import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  imports: {
    dirs: ["src"],
  },
  build: {
    transpile: ["@shopware/composables"],
  },
  telemetry: {
    enabled: false,
  },
}) as NuxtConfig;
