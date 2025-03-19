// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "@shopware/cms-base-layer",
    "../../packages/layers/layout",
    "../../packages/layers/ui-light-theme",
  ],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },

  modules: ["@shopware/nuxt-module"],
  typescript: {
    // typeCheck: true,
    strict: true,
  },

  telemetry: false,
});
