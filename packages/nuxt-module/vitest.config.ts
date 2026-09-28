import { defineConfig } from "vitest/config";

export default defineConfig({
  // Nuxt injects these at build time; a test flips the globals. Vitest's
  // "node" environment runs through the SSR environment, so the define must
  // be set there rather than at the top level (which only affects "client").
  environments: {
    ssr: {
      define: {
        "import.meta.server": "globalThis.__NUXT_IMPORT_META_SERVER__",
        "import.meta.client": "globalThis.__NUXT_IMPORT_META_CLIENT__",
      },
    },
  },
  test: {
    environment: "node",
  },
});
