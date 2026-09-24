import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://your-shop.shopware.store/store-api",
        accessToken: "your-access-token",
        // Optional: Required for local development when using customer registration
        // devStorefrontUrl: "https://your-shop.shopware.store",
      },
    },
  },
});
