// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],

  runtimeConfig: {
    // These values are used in the Shopware API client
    // TODO: replace with environment variables copied from Github once feature is supported
    api_client_id: "SWIARW9QA2DYOUX3OXJMRGX2UQ", // or import.meta.env.NUXT_SHOPWARE_ACCESS_KEY_ID when .env is defined
    api_client_secret: "dTRpT3ptZDlmMHZocDNrb2ZOODYxYWtIWnZtRTByUnBvRXh5M3Q", // or import.meta.env.NUXT_SHOPWARE_SECRET_ACCESS_KEY  when .env is defined
  },

  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },

  modules: ["@shopware/nuxt-module", "@nuxtjs/i18n"],

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

  telemetry: false,
  compatibilityDate: "2025-02-03",
});
