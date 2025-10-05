import { URL, fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  optimizeDeps: {
    exclude: ["@shopware/composables"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#imports": fileURLToPath(new URL("./imports.d.ts", import.meta.url)),
    },
  },
});
