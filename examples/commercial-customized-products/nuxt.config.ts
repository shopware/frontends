// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ["@shopware-pwa/composables-next/nuxt-layer"],

  shopware: {
    endpoint: "http://localhost:8000/store-api/",
    accessToken: "SWSCZJLOU1JXSWX2A3RSR3EWYG",
  },

  modules: ["@shopware-pwa/nuxt3-module"],

  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },

  telemetry: false,

  app: {
    head: {
      script: [{ src: "https://cdn.tailwindcss.com" }],
    },
  },

  compatibilityDate: "2024-09-27",
});
