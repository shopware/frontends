// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@shopware/nuxt-module", "@unocss/nuxt", "nuxt3-notifications"],
  shopware: {
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    devStorefrontUrl: "",
  },
  ssr: false,
});
