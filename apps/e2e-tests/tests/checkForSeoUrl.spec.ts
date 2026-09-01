import { expect, test } from "@playwright/test";

import { HomePage } from "../page-objects/HomePage";

test.describe("Check for seo-url requests", { tag: "@storefront" }, () => {
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
    await expect(SeoUrlRequest).toBe(false);
    await homePage.openCartPage();
    await expect(SeoUrlRequest).toBe(false);
    // Any nav entry will do. Clicked rather than navigated to, because this
    // test is about client-side routing not issuing seo-url requests.
    await page.locator('[role="menubar"] [role="menuitem"]').first().click();
    await expect(SeoUrlRequest).toBe(false);
  });
});
