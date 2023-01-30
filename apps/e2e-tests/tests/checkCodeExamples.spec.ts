import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const directoryPath = path.join(__dirname, "/../../../examples/");

fs.readdirSync(directoryPath).forEach((file) => {
  test(`Verify ${file}`, async ({ page }) => {
    const response = await page.goto(
      `https://stackblitz.com/github/shopware/frontends/tree/main/examples/${file}?embed=1&theme=light&ctl=1&initialPath=%2F&view=preview`
    );
    await page.waitForLoadState("domcontentloaded");
    await page.locator("button[class='ClickToLoad-actionBtn-bTGgA']").click();
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
