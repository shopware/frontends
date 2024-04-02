import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// names of the directories that should not be tested in StackBlitz context in case of more complex setup
// in that case an example should be tested manually
const IGNORE_CHECK_EXAMPLES = [
  "mollie-credit-card",
  "adyen-dropin-component",
  "commercial-quick-order",
  "strapi-cms",
  "README.md",
  // TODO: https://github.com/shopware/frontends/issues/678
];

const directoryPath = path.join(__dirname, "../../../examples/");

fs.readdirSync(directoryPath)
  .filter((file) => !IGNORE_CHECK_EXAMPLES.includes(file))
  .forEach((file) => {
    test(`Verify ${file}`, async ({ page }) => {
      const exampleName = `shopware/frontends/tree/main/examples/${file}`;
      await page.goto("file://" + __dirname + "/pages/blank.html", {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });
      await Promise.all([
        page.waitForLoadState("networkidle"),
        page.evaluate((exampleName) => {
          window.StackBlitzSDK.openGithubProject(exampleName, {
            clickToLoad: false,
            newWindow: false,
            origin: "https://stackblitz.com",
          });
        }, exampleName),
      ]);
      expect(page.url()).toContain(
        `https://stackblitz.com/github/${exampleName}`,
      );
      expect(await page.title()).toContain("Frontends");
      await page
        .locator('iframe[title="Preview page"]')
        .waitFor({ state: "visible" });

      expect(await page.locator('iframe[title="Preview page"]')).toBeVisible();
      expect(await page.mainFrame().content()).toContain("test-wrapper");
    });
  });
