// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@shopware/nuxt-module", "@nuxtjs/sanity"],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "<your-sales-channel-access-token>",
  },
  sanity: {
    projectId: "<your-project-id>",
    dataset: "production",
    apiVersion: "2026-05-15",
    useCdn: true, // public, cacheable reads
  },
});
