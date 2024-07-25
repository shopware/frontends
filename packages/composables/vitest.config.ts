import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
      include: ["src"],
      thresholds: {
        100: true,
      },
      exclude: [
        "**/devtools/**",
        "**/types/**",
        "**/src/*.test.ts",
        "**/src/*.spec.ts",
        // After refactoring should be removed - https://github.com/shopware/frontends/issues/1057
        "**/src/useListing.ts",
      ],
    },
    alias: {
      "#imports": resolve(__dirname, "./src/index.ts"),
    },
  },
});
