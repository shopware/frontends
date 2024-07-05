import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
      // "100": true, // TODO: our goal ;)
      thresholds: {
        statements: 97,
        branches: 81,
        functions: 89,
        lines: 97,
      },
      exclude: [
        "**/temp/**",
        "**/devtools/**",
        "**/.eslintrc.cjs",
        "**/nuxt.config.ts",
        "**/composables/index.ts",
      ],
    },
    alias: {
      "#imports": resolve(__dirname, "./src/index.ts"),
    },
  },
});
