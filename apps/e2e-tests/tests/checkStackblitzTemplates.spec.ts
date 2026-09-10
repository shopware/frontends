import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

declare global {
  interface Window {
    StackBlitzSDK: {
      openGithubProject: (
        templateName: string,
        options: { clickToLoad: boolean; newWindow: boolean; origin: string },
      ) => void;
    };
  }
}

// Only scaffoldable templates can boot outside the monorepo, so only they can
// pass on StackBlitz.
const manifestPath = path.join(__dirname, "../../../templates/manifest.json");
const { templates } = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
  templates: Array<{ id: string; scaffoldable: boolean }>;
};

for (const template of templates.filter((t) => t.scaffoldable)) {
  test(`Open, { tag: "@stackblitz" },  ${template.id}`, async ({ page }) => {
    test.setTimeout(200000);
    const templateName = `shopware/frontends/tree/main/templates/${template.id}`;
    await page.goto(`file://${__dirname}/pages/blank.html`, {
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
    );
    await expect(page).toHaveURL(
      `https://stackblitz.com/github/shopware/frontends/tree/main/templates/${template.id}?file=README.md`,
    );

    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.log(msg.text());
        consoleLogs.push(msg.text());
      }
      expect(msg.type()).not.toBe("error");
    });

    page.on("response", (response) => {
      expect(response.status()).toBe(200);
    });
  });
}
