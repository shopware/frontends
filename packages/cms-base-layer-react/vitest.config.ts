import { defineConfig } from "vitest/config";

const DOM_TESTS = "src/**/*.dom.test.tsx";

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: [DOM_TESTS],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "happy-dom",
          include: [DOM_TESTS],
        },
      },
    ],
    coverage: {
      enabled: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/types/**",
        "src/__fixtures__/**",
      ],
    },
  },
});
