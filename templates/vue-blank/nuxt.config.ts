// https://v3.nuxtjs.org/api/configuration/nuxt.config
const isStackBlitz = process.env.SHOPWARE_STACKBLITZ === "true";

export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  ...(isStackBlitz ? { devtools: { enabled: false } } : {}),
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  modules: ["@shopware/nuxt-module"],
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  telemetry: false,
});
