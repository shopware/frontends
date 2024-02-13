// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: [
    "@shopware-pwa/composables-next/nuxt-layer",
    "@shopware-pwa/cms-base",
  ],
  runtimeConfig: {
    api_client_id: "SWIARW9QA2DYOUX3OXJMRGX2UQ", // or import.meta.env.NUXT_SHOPWARE_ACCESS_KEY_ID when .env is defined
    api_client_secret: "dTRpT3ptZDlmMHZocDNrb2ZOODYxYWtIWnZtRTByUnBvRXh5M3Q", // or import.meta.env.NUXT_SHOPWARE_SECRET_ACCESS_KEY  when .env is defined
    public: {
      shopware: {
        shopwareEndpoint: "https://demo-frontends.shopware.store/store-api",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
    },
  },
  modules: ["@shopware-pwa/nuxt3-module", "@nuxtjs/i18n"],
  typescript: {
    strict: true,
  },
  i18n: {
    defaultLocale: "en-GB",
    detectBrowserLanguage: false,
    langDir: "./i18n/langs",
    locales: [
      {
        code: "en-GB",
        iso: "en-GB",
        file: "all.ts",
      },
      {
        code: "de-DE",
        iso: "de-DE",
        file: "all.ts",
      },
    ],
  },
});
