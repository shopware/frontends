// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["./shopTheme", "./base", "@shopware/composables/nuxt-layer"],
  modules: ["@shopware/nuxt-module", "@unocss/nuxt", "@shopware/nuxt-module"],
  shopware: {
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    devStorefrontUrl: "",
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  unocss: {
    nuxtLayers: true,
  },
});
