import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
    },
    alias: {
      "#imports": resolve(__dirname, "./composables.d.ts"),
      "#shopware": resolve(__dirname, "./types/api-types.d.ts"),
    },
  },
});
