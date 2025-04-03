// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [
    "@shopware/composables/nuxt-layer",
    "../../packages/layers/layout",
    "../../packages/layers/product",
  ],
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/storybook", "@unocss/nuxt", "@shopware/nuxt-module"],
  unocss: {
    nuxtLayers: true,
  },
  shopware: {
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    devStorefrontUrl: "",
  },
  experimental: { appManifest: false },
});
