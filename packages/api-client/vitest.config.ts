import { defineConfig } from "vitest/config";
import codspeedPlugin from "@codspeed/vitest-plugin";

export default defineConfig({
  plugins: [codspeedPlugin()],
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
