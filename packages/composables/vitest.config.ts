import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
      include: ["src"],
      // "100": true, // TODO: our goal ;)
      thresholds: {
        statements: 97,
        branches: 90,
        functions: 88.4,
        lines: 97,
      },
      exclude: ["**/devtools/**"],
    },
    alias: {
      "#imports": resolve(__dirname, "./src/index.ts"),
    },
  },
});
