import { fileURLToPath } from "url";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware-pwa/composables-next/nuxt-layer"],
  modules: ["@nuxtjs/i18n"],

  runtimeConfig: {
    public: {
      shopware: {
        useUserContextInSSR: false,
        devStorefrontUrl: "",

        salesChannels: {
          international: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
            locales: ["en-GB"],
          },
          germany: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
            locales: ["de-DE"],
          },
          poland: {
            endpoint: "https://demo-frontends.shopware.store/store-api/",
            accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
            locales: ["pl-PL"],
          },
        },
      },
    },
  },

  i18n: {
    strategy: "prefix",
    defaultLocale: "en-GB",
    // Locales from the i18n plugin have to match the sales channel configuration
    locales: [
      {
        code: "en-GB",
        iso: "en-GB",
      },
      {
        code: "de-DE",
        iso: "de-DE",
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
});
