import { defineNuxtConfig } from "nuxt/config";

// nuxt.config.ts
export default defineNuxtConfig({
  shopware: {
    endpoint: "https://your-shop.shopware.store/store-api",
    accessToken: "your-access-token",
    devStorefrontUrl: "https://your-shop.shopware.store", // must match a Sales Channel domain
  },
});
