import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reportOnFailure: true,
      thresholds: {
        "100": true,
      },
    },
  },
});
