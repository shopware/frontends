// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  compatibilityDate: "2025-04-15",
  devtools: { enabled: true },
  modules: [
    "@unocss/nuxt",
    "@shopware/nuxt-module",
    "@nuxtjs/i18n",
    "@nuxt/icon",
  ],
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://demo-frontends.shopware.store",
        accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  icon: {
    customCollections: [
      {
        prefix: "shopware",
        dir: "./app/assets/icons",
      },
    ],
  },
});
