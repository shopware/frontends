import { fileURLToPath } from "node:url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@nuxtjs/i18n", "@unocss/nuxt"],

  runtimeConfig: {
    public: {
      shopware: {
        useUserContextInSSR: false,
        devStorefrontUrl: "",
        // Declaration of sales channels
        salesChannels: {
          international: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
            locales: ["en-GB"],
          },
          poland: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "SWSCA2XUULHZBVZTSHVOTM5QAA",
            locales: ["pl-PL"],
          },
        },
      },
    },
  },

  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en-GB",
    detectBrowserLanguage: false,
    // Locales from the i18n plugin have to match the sales channel configuration
    locales: [
      {
        code: "en-GB",
        iso: "en-GB",
      },
      {
        code: "pl-PL",
        iso: "pl-PL",
      },
    ],
  },

  typescript: {
    strict: true,
  },

  telemetry: false,
  compatibilityDate: "2025-04-17",
});
