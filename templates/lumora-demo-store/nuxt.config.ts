// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["../vue-starter-template"],
  compatibilityDate: "2025-12-05",
  modules: ["@unocss/nuxt"],
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://demo-frontends.shopware.store/store-api/",
        accessToken: "SWSCT0RWATU1RG9RT200M29XNA",
        devStorefrontUrl: "https://frontends-demo.vercel.app",
      },
    },
  },
  unocss: {
    nuxtLayers: true,
  },
});
