import { defineConfig } from "astro/config";

import node from "@astrojs/node";
// https://astro.build/config
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    vue({
      appEntrypoint: "/src/entrypoints/_shopware",
    }),
  ],
});
