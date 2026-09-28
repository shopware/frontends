export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  compatibilityDate: "2024-11-01",
  modules: ["@shopware/nuxt-module", "@unocss/nuxt"],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  experimental: { appManifest: false },
  telemetry: false,
});
