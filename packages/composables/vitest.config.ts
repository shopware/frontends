import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true,
      // "100": true, // TODO: our goal ;)
      thresholds: {
        statements: 94,
        branches: 80,
        functions: 82,
        lines: 92,
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
