import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
      // "100": true, // TODO: our goal ;)
      thresholds: {
        statements: 92,
        branches: 80,
        functions: 80,
        lines: 92,
      },
    },
    alias: {
      "#imports": resolve(__dirname, "./src/index.ts"),
    },
  },
});
