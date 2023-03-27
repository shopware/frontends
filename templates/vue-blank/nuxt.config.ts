// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: process.env.API_URL,
        shopwareAccessToken: process.env.API_ACCESS_TOKEN,
      },
    },
  },
  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module"],
  typescript: {
    typeCheck: true,
    strict: true,
  },
});
