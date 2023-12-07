import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

// names of the directories that should not be tested in StackBlitz context in case of more complex setup
// in that case an example should be tested manually
const IGNORE_CHECK_EXAMPLES = ["mollie-credit-card", "adyen-dropin-component"];

const directoryPath = path.join(__dirname, "../../../examples/");

fs.readdirSync(directoryPath)
  .filter((file) => !IGNORE_CHECK_EXAMPLES.includes(file))
  .forEach((file) => {
    test(`Verify ${file}`, async ({ page }) => {
      const response = await page.goto(
        `https://stackblitz.com/github/shopware/frontends/tree/main/examples/${file}?embed=1&theme=light&ctl=1&initialPath=%2F&view=preview`,
      );
      await page.waitForLoadState("domcontentloaded");
      await page.locator("button[class^='ClickToLoad-actionBtn']").click();
      await page.waitForLoadState("networkidle");

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
