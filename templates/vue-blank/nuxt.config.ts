// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "../../packages/layers/layout",
    "../../packages/layers/product",
    "../../packages/layers/cart",
    "../../packages/layers/checkout/",
    //"../../packages/layers/one-page-checkout",
    //"../../packages/layers/ui-dark-theme",
    "../../packages/layers/ui-light-theme",
  ],

  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },

  modules: ["@shopware/nuxt-module", "@unocss/nuxt", "@vueuse/nuxt"],

  typescript: {
    strict: true,
  },

  telemetry: false,
  router: {},

  devtools: {
    timeline: {
      enabled: true,
    },
  },
});
