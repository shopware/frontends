import { defineConfig, devices } from "@playwright/test";
import find from "find-up";
export const findEnv = () => find.sync(process.env.ENV_FILE || ".env");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();
require("dotenv").config({ path: findEnv() });
/**
 * See https://playwright.dev/docs/test-configuration.
 */
const baseURL = process.env.BASE_API_URL;
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      "content-type": "application/json",
      "sw-access-key": `${process.env.API_ACCESS_KEY}`,
      trace: "on-first-retry",
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
