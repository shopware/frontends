// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["@shopware-pwa/composables-next/nuxt-layer"],
  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module", "@unocss/nuxt"],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  css: [
    "@unocss/reset/tailwind-compat.css", // needed to reset styles see https://unocss.dev/guide/style-reset (@unocss/reset)
  ],
  devtools: { enabled: true },
});
