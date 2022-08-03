import { defineNuxtConfig } from "nuxt";
import transformerDirective from "@unocss/transformer-directives";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  typescript: {
    typeCheck: true,
    strict: true,
  },
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
    theme: {
      colors: {
        brand: {
          primary: "#189eff",
          light: "#5ebbff",
          dark: "#0081df",
        },
      },
    },
  },
});
