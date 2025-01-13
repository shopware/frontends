// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: [
    "@shopware-pwa/composables-next/nuxt-layer",
    "./layers/commercial-advanced-search",
  ],

  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },

  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module"],

  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },

  telemetry: false,

  watch: ["./layers"],

  app: {
    head: {
      script: [{ src: "https://cdn.tailwindcss.com" }],
    },
  },

  compatibilityDate: "2024-09-27",
});
