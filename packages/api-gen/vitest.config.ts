import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reportOnFailure: true,
      include: ["src"],
      exclude: [
        // "**/cli.ts", // this file is only a config
        // "**/patches.ts", // this file will be removed, as patching is done by overrides now
        // "**/commands/generate.ts", // TODO: this file should be tested
        // "**/*.test-d.ts",
        // "**/*.bench.ts",
        // "**/*/playground.ts",
      ],
      thresholds: {
        // {
        "**/**.rule.ts": {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
        // }
      },
    },
  },
});
