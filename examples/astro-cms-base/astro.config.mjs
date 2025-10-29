import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import UnoCSS from "unocss/astro";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue(),
    UnoCSS({
      injectReset: true,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@shopware/cms-base-layer": resolve(
          __dirname,
          "../../packages/cms-base-layer",
        ),
        "@shopware/composables": resolve(
          __dirname,
          "../../packages/composables/src",
        ),
        "@shopware/helpers": resolve(__dirname, "../../packages/helpers/src"),
        "@shopware/api-client": resolve(
          __dirname,
          "../../packages/api-client/src",
        ),
      },
    },
  },
});
