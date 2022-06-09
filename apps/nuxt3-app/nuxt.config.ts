import { defineNuxtConfig } from "nuxt";
import transformerDirective from "@unocss/transformer-directives";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: [
    "@vueuse/nuxt",
    "@unocss/nuxt",
    "@shopware-pwa/nuxt3-module",
    "@shopware-pwa/cms-base",
  ],
  components: true,
  // components: {
  //   global: true,
  //   dirs: ["~/components"],
  // },
  vueuse: {
    ssrHandlers: true,
  },
  unocss: {
    preflight: true,
    transformers: [transformerDirective()],
  },
});
