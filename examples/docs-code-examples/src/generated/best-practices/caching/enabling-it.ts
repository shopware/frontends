import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  shopware: {
    cacheableReads: true, // route anonymous Store API reads through cacheable GET routes
  },
});
