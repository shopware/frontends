// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Shopware Frontends layer: composables like useProductSearch, useAddToCart, usePrice
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@shopware/nuxt-module", "@nuxtjs/sanity", "@nuxtjs/tailwindcss"],
  shopware: {
    // Public Shopware demo store - commerce data (products, prices, media)
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCNWDGMUWZM0TLVUU0YKLQVW",
  },
  sanity: {
    // Sanity project that owns the editorial content / page builder. Public-read
    // datasets need no token. Override via env (.env.dist) for your own project.
    projectId: process.env.NUXT_SANITY_PROJECT_ID || "0celbjjf",
    dataset: process.env.NUXT_SANITY_DATASET || "production",
    apiVersion: "2026-05-15",
    useCdn: true,
  },
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  telemetry: false,
  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
        },
      ],
    },
  },
});
