import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const directoryPath = path.join(__dirname, "../../../templates/");

fs.readdirSync(directoryPath).forEach((template) => {
  test(`Open ${template}`, async ({ page }) => {
    test.setTimeout(200000);
    const templateName = `shopware/frontends/tree/main/templates/${template}`;
    await page.goto("file://" + __dirname + "/pages/blank.html", {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    await Promise.all([
      // page.waitForLoadState('networkidle'),
      page.waitForLoadState("load"),
      page.evaluate((templateName) => {
        window.StackBlitzSDK.openGithubProject(templateName, {
          clickToLoad: false,
          newWindow: false,
          origin: "https://stackblitz.com",
        });
      }, templateName),
    ]);
    await page.waitForRequest(
      "https://demo-frontends.shopware.store/store-api/context",
    ),
      await expect(page).toHaveURL(
        `https://stackblitz.com/github/shopware/frontends/tree/main/templates/${template}?file=README.md`,
      );

    const consoleLogs = [];
    page.on("console", (msg) => {
      if (msg.type() == "error") {
        console.log(msg.text());
        consoleLogs.push(msg.text());
      }
      expect(msg.type()).not.toBe("error");
    });

    page.on("response", (response) => {
      expect(response.status()).toBe(200);
    });
  });
});
