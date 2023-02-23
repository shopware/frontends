import { defineConfig } from "astro/config";

// https://astro.build/config
import vue from "@astrojs/vue";
import node from "@astrojs/node";

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
