import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  // Other configurations...
  runtimeConfig: {
    public: {
      broadcasting: true,
    },
  },
});
