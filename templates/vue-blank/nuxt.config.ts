// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ["@shopware-pwa/composables-next", "@shopware-pwa/cms-base"],
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
    },
  },
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },
});
