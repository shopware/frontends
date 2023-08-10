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
  modules: [
    "@vueuse/nuxt",
    "@shopware-pwa/nuxt3-module",
    ["@storyblok/nuxt", { accessToken: process.env.STORYBLOK_ACCESS_TOKEN }],
  ],
  vite: {
    // this fixes an error during vite build, see https://stackoverflow.com/questions/76070899/nuxt-3-vite-fails-to-build-because-of-fsevents-node
    optimizeDeps: { exclude: ["fsevents"] },
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
