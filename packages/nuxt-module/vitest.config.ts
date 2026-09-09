import { defineConfig } from "vitest/config";

export default defineConfig({
  // Nuxt injects these at build time; a test flips the globals.
  define: {
    "import.meta.server": "globalThis.__NUXT_IMPORT_META_SERVER__",
    "import.meta.client": "globalThis.__NUXT_IMPORT_META_CLIENT__",
  },
  test: {
    environment: "node",
  },
});
