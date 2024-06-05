import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
      // "100": true, // TODO: our goal ;)
    },
    alias: {
      "#imports": resolve(__dirname, "./src/index.ts"),
    },
  },
});
