import { test, expect, request } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";

test.describe.only("Check for seo-url requests", () => {
  let homePage: HomePage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visitMainPage();
  });

  test("Check for seo-url requests", async ({ page }) => {
    await homePage.visitMainPage();
    await page.waitForLoadState("networkidle");
    await expect(page.waitForRequest("**/store-api/seo-url")).toThrowError();
    await homePage.openCartPage();
    await page.waitForLoadState("networkidle");
    await expect(page.waitForRequest("**/store-api/seo-url")).toThrowError();
  });
});
