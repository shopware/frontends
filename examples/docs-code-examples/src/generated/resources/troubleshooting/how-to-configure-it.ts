// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://your-shop.shopware.store/store-api",
        accessToken: "your-access-token",
        devStorefrontUrl: "https://your-shop.shopware.store", // must match a domain in Sales Channel settings
      },
    },
  },
});
