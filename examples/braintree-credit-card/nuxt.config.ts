export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@vueuse/nuxt", "@unocss/nuxt", "@shopware/nuxt-module"],
  shopware: {
    // Shopware 6 instance with Braintree app installed
    endpoint: "https://demo-frontends.shopware.store/store-api",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  runtimeConfig: {
    public: {
      loginData: {
        // Demo customer credentials - adjust to your test account
        username: "",
        password: "",
      },
    },
  },
  css: ["@unocss/reset/tailwind-compat.css"],
  devtools: { enabled: true },
  telemetry: false,
  compatibilityDate: "2024-08-06",
});
