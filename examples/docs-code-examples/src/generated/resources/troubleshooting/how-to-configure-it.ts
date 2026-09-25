// nuxt.config.ts
import { defineNuxtConfig } from "nuxt/config";

const config = {
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://your-shop.shopware.store/store-api",
        accessToken: "your-access-token",
        devStorefrontUrl: "https://your-shop.shopware.store", // must match a domain in Sales Channel settings
      },
    },
  },
};

export default defineNuxtConfig(config);
