import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * Config for the vue-starter-template e2e tests (tag: @vue-starter-template).
 *
 * Run a local starter template first, then:
 *   BASE_E2E_URL=http://localhost:3000 \
 *     pnpm exec playwright test -c starter.config.ts
 *
 * Kept separate from playwright.config.ts because that suite targets the
 * vue-demo-store deployment, while these tests drive the starter template.
 */
const baseURL = process.env.BASE_E2E_URL || "http://localhost:3000";

console.log("Running starter-template e2e tests for: ", baseURL);

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  outputDir: "./reports",
  // Only the starter-template specs. Other specs in ./tests import a helper
  // (find-up based) that fails to load in this workspace, which would break
  // test collection for the whole directory.
  testMatch: "**/searchFilters.spec.ts",
  grep: /@vue-starter-template/,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: false,
  forbidOnly: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    actionTimeout: 0,
    trace: "retain-on-failure",
    testIdAttribute: "data-testid",
    baseURL,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};

export default config;
