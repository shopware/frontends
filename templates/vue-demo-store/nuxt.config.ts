import i18nConfig from "./i18n/src/config";
// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    shopware: {
      /**
       * SSR Shopware Endpoint
       * More here: https://frontends.shopware.com/getting-started/templates/custom-vue-project.html#shopware-endpoint-on-the-ssr-mode
       */
      shopwareEndpoint: "",
    },
    public: {
      shopware: {
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
        devStorefrontUrl: "",
      },
    },
  },
  routeRules: {
    "/": {
      isr: 60 * 60 * 24,
    },
    "/checkout": {
      ssr: false,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
    "/checkout/**": {
      ssr: false,
    },
    "/login": {
      ssr: false,
    },
    "/register": {
      ssr: false,
    },
    "/reset-password": {
      ssr: false,
    },
    "/wishlist": {
      ssr: false,
    },
    "/account": {
      ssr: false,
    },
    "/account/**": {
      ssr: false,
    },
    "/search": {
      ssr: false,
    },
    "/search/**": {
      ssr: false,
    },
    "/**": {
      isr: 60 * 60 * 24,
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
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@shopware-pwa/nuxt3-module",
    "@shopware-pwa/cms-base",
    "@nuxt/devtools",
    "@nuxtjs/i18n",
  ],
  // components: true,
  components: {
    dirs: [
      {
        path: "~/components",
        priority: 2,
      },
    ],
    global: true,
  },
  vueuse: {
    ssrHandlers: true,
  },
  nitro: {
    compressPublicAssets: true,
  },
  unocss: {
    // for presets, theme config, ... look at the uno.config.ts file
  },
  css: [
    "@unocss/reset/tailwind-compat.css", // needed to reset styles see https://unocss.dev/guide/style-reset (@unocss/reset)
  ],
  router: {
    options: {
      linkExactActiveClass: "text-brand-primary",
    },
  },
  i18n: {
    vueI18n: {
      fallbackLocale: "en-GB",
    },
    strategy: "prefix_except_default",
    defaultLocale: i18nConfig.defaultLocale,
    langDir: "i18n/src/",
    locales: i18nConfig.locales,
  },
});
