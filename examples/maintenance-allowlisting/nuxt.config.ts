// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@shopware/nuxt-module", "@unocss/nuxt"],
  shopware: {
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    devStorefrontUrl: "",
  },
  experimental: { appManifest: false },
});
