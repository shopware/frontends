// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer", "@shopware/cms-base-layer"],
  compatibilityDate: "2025-04-15",
  devtools: { enabled: true },
  modules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@shopware/nuxt-module",
    "@nuxtjs/i18n",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/a11y",
  ],
  runtimeConfig: {
    public: {
      shopware: {
        endpoint: "https://demo-frontends.shopware.store/store-api/",
        accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
        devStorefrontUrl: "https://frontends-demo.vercel.app",
      },
    },
  },
  typescript: {
    strict: true,
  },
  css: ["@unocss/reset/tailwind-compat.css"],
  unocss: {
    nuxtLayers: true,
  },
  components: [
    {
      path: resolve("./app/components"),
      priority: 2,
      global: true,
      extensions: [".vue"],
    },
  ],
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en-GB",
    detectBrowserLanguage: false,
    langDir: "./src/langs/",
    vueI18n: resolve("./config"),
    locales: [
      {
        code: "en-GB",
        language: "en-GB",
        file: "en-GB.ts",
      },
      {
        code: "pl-PL",
        language: "pl-PL",
        file: "pl-PL.ts",
      },
      {
        code: "de-DE",
        file: "de-DE.ts",
        language: "de-DE",
      },
    ],
  },
  icon: {
    customCollections: [
      {
        prefix: "shopware",
        dir: resolve("./app/assets/icons"),
      },
    ],
  },
  routeRules: {
    "/checkout": {
      ssr: false,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    },
    "/checkout/**": {
      ssr: false,
    },
    "/account": {
      ssr: false,
    },
    "/account/**": {
      ssr: false,
    },
    "/wishlist": {
      ssr: false,
    },
  },
  imports: {
    dirs: [
      "utils",
      "utils/**",
      resolve("./i18n/utils"),
      resolve("./i18n/src/helpers"),
    ],
  },
});
