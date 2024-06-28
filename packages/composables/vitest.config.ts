import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
      // "100": true, // TODO: our goal ;)
      thresholds: {
        statements: 95,
        branches: 80,
        functions: 84,
        lines: 95,
      },
      exclude: [
        "**/temp/**",
        "**/devtools/**",
        "**/.eslintrc.cjs",
        "**/nuxt.config.ts",
      ],
    },
    alias: {
      "#imports": resolve(__dirname, "./src/index.ts"),
    },
  },
});
