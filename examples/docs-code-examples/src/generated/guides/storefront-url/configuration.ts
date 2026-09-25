import { defineNuxtConfig } from "nuxt/config";

// nuxt.config.ts
export default defineNuxtConfig({
  shopware: {
    endpoint: "https://your-shop.shopware.store/store-api",
    accessToken: "your-access-token",
    // must match a domain in Sales Channel -> Domains
    devStorefrontUrl: "https://your-shop.shopware.store",
  },
});
