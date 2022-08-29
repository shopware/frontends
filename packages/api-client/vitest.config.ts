import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      // "100": true, // TODO: our goal ;)
    },
  },
});
