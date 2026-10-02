import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const DOM_TESTS = "**/*.dom.test.tsx";
const EXCLUDED = ["node_modules/**", ".next/**"];

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["**/*.test.{ts,tsx}"],
          exclude: [...EXCLUDED, DOM_TESTS],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "happy-dom",
          include: [DOM_TESTS],
          exclude: EXCLUDED,
        },
      },
    ],
  },
});
