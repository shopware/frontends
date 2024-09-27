// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware-pwa/composables-next/nuxt-layer"],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@shopware-pwa/nuxt3-module", "@unocss/nuxt"],
  shopware: {
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    devStorefrontUrl: "",
  },
  ssr: false,
});
