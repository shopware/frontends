import { fileURLToPath } from "node:url";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: ["@shopware/composables/nuxt-layer"],
  modules: ["@vueuse/nuxt", "@shopware-pwa/nuxt3-module"],
  shopware: {
    endpoint: "https://demo-frontends.shopware.store/store-api/",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
  },
  runtimeConfig: {
    public: {
      mollie: {
        defaultLocale: "en_US",
        profileId: "pfl_E5EmGZ98YT",
        testMode: true,
      },
    },
  },

  alias: {
    "@/types": fileURLToPath(new URL("./types.d.ts", import.meta.url)),
  },
  /**
   * Commented because of the StackBlitz error
   * Issue: https://github.com/shopware/frontends/issues/88
   */
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  telemetry: false,
});
