import { test, expect, request } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";

test.describe.only("Check for seo-url requests", () => {
  let homePage: HomePage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visitMainPage();
  });

  test("should not show any seo-url requests during internal navigation", async ({
    page,
  }) => {
    let SeoUrlRequest = false;
    page.on("request", (request) => {
      if (request.url().includes("seo-url")) SeoUrlRequest = true;
    });

    await homePage.visitMainPage();
    await page.waitForLoadState("networkidle");
    await expect(SeoUrlRequest).toBe(false);
    await homePage.openCartPage();
    await page.waitForLoadState("networkidle");
    await expect(SeoUrlRequest).toBe(false);
    await page
      .getByRole("menuitem", { name: "Summer Trends", exact: true })
      .click();
    await page.waitForLoadState("networkidle");
    await expect(SeoUrlRequest).toBe(false);
  });
});
