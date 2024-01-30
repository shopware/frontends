import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reportOnFailure: true,
      include: ["src"],
      exclude: [
        "**/*.test.ts",
        "**/*.test-d.ts",
        "**/*.bench.ts",
        "**/*/playground.ts",
      ],
      thresholds: {
        "100": true,
      },
    },
  },
});
