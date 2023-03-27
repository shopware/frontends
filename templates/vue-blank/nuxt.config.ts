// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "https://you.endpoint.com",
        shopwareAccessToken: "your-access-token",
      },
    },
  },
  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module"],
  typescript: {
    typeCheck: true,
    strict: true,
  },
});
