import transformerDirective from "@unocss/transformer-directives";
import i18nConfig from "./i18n/src/config";
import { VueDisableInputsBeforeMount } from "vite-vue-plugin-disable-selects";
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
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  debug: true,
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
    vueI18n: {
      fallbackLocale: "en-GB",
    },
    strategy: "prefix_except_default",
    defaultLocale: i18nConfig.defaultLocale,
    langDir: "i18n/src/",
    locales: i18nConfig.locales,
  },
  vite: {
    plugins: [VueDisableInputsBeforeMount()],
  },
});
