import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const directoryPath = path.join(__dirname, "../../../templates/");

fs.readdirSync(directoryPath).forEach((template) => {
  test(`Open ${template}`, async ({ page }) => {
    test.setTimeout(90000);
    await page.goto("/pages/blank.html");
    await Promise.all([
      page.waitForLoadState("load"),
      page.evaluate((template) => {
        window.StackBlitzSDK.openGithubProject(
          `shopware/frontends/tree/main/templates/${template}`,
          {
            clickToLoad: false,
            newWindow: false,
            origin: "https://stackblitz.com/",
          },
        );
      }, template),
    ]);
    await page.waitForRequest(
      "https://demo-frontends.shopware.store/store-api/context",
    ),
      await expect(page).toHaveURL(
        `https://stackblitz.com/github/shopware/frontends/tree/main/templates/${template}?file=README.md`,
      );

    page.on("response", (response) => {
      expect(response.status()).not.toBe(500);
    });
  });
});
