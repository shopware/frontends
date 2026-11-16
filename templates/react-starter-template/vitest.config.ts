import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      enabled: true,
      include: ["cms/**/*.{ts,tsx}"],
      exclude: [
        "cms/**/*.test.{ts,tsx}",
        "cms/types/**",
        "cms/__fixtures__/**",
      ],
    },
  },
});
