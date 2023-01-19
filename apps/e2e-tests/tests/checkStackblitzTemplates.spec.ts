import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";

test("Verify stackblitz template", async ({ page }) => {
  let homePage: HomePage;
  const response = await page.goto("");
  homePage = new HomePage(page);
  await page.waitForLoadState();
  await page.locator("text=Open in New Tab").click();
  await page.waitForLoadState("domcontentloaded");
  await homePage.wait(10000);

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
