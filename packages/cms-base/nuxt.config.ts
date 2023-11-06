import { defineNuxtConfig } from "nuxt/config";
import type { NuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  components: [
    {
      path: "./components/public",
      pathPrefix: false,
      // global: true,
    },
  ],
});
