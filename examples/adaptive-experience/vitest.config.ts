import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // `#shared` is a Nuxt build-time alias, so a plain vitest run has to be
      // told about it. Only needed for value imports; type-only imports are
      // erased before they reach the resolver.
      "#shared": fileURLToPath(new URL("./shared", import.meta.url)),
    },
  },
  test: {
    // The contract library and the planner provider are free of Vue/Nuxt, so
    // they run in a plain node environment. The composables and components need
    // the Nuxt harness and are exercised through the running app instead.
    include: ["shared/**/*.test.ts", "server/**/*.test.ts"],
    environment: "node",
  },
});
