// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  compatibilityDate: "2025-04-15",
  devtools: { enabled: true },
  modules: ["@unocss/nuxt", "@shopware/nuxt-module", "@nuxtjs/i18n"],
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://demo-frontends.shopware.store/store-api/",
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
  components: {
    dirs: [
      {
        path: "~/components",
        priority: 2,
      },
    ],
    global: true,
  },
});
