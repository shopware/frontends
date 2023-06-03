import transformerDirective from "@unocss/transformer-directives";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      shopware: {
        shopwareEndpoint: "https://demo-frontends.shopware.store",
        shopwareAccessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
        devStorefrontUrl: "",
      },
    },
  },
  alias: {
    /**
     * TODO: Temp fix until new VueUse published:
     * - https://github.com/vueuse/vueuse/pull/2449
     * - https://github.com/vueuse/vueuse/actions/workflows/publish.yml
     */
    useMeta: "~/composables/useMeta",
  },
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    /**
     * Uncomment after upgrading to 3.5.*
     */
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
    dirs: ["~/components"],
    global: true,
  },
  vueuse: {
    ssrHandlers: true,
  },
  // Unocss bug fix https://github.com/nuxt/framework/issues/7623
  experimental: {
    inlineSSRStyles: false,
  },
  nitro: {
    compressPublicAssets: true,
  },
  unocss: {
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,
    preflight: true,
    transformers: [transformerDirective()],
    theme: {
      extend: {
        width: "width",
        height: "height",
      },
      colors: {
        brand: {
          primary: "#189eff",
          light: "#5ebbff",
          dark: "#0081df",
        },
      },
    },
  },
  router: {
    options: {
      linkExactActiveClass: "text-brand-primary",
    },
  },
  i18n: {
    strategy: "no_prefix",
    langDir: "i18n/src/",
    locales: [
      {
        code: "en-US",
        iso: "en-US",
        file: "en-US.ts",
      },
    ],
  },
});
