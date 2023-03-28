// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
      },
    },
  },
  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module"],
  // typescript: {
  //   typeCheck: true,
  //   strict: true,
  // },
});
