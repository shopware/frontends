// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  runtimeConfig: {
    // Admin API integration credentials, read by ./server/api/translations.get.ts
    // Set NUXT_API_CLIENT_ID and NUXT_API_CLIENT_SECRET in .env (see .env.template)
    api_client_id: "",
    api_client_secret: "",
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
    langDir: "./langs",
    locales: [
      {
        code: "en-GB",
        language: "en-GB",
        file: { path: "en-GB.ts", cache: false },
      },
      {
        code: "de-DE",
        language: "de-DE",
        file: { path: "de-DE.ts", cache: false },
      },
    ],
  },
  telemetry: false,
});
