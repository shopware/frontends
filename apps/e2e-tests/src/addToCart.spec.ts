import { test, expect } from "@playwright/test";

test("add product to cart*", async ({ page }) => {
  await page.goto("/");

  await Promise.all([
    page.waitForNavigation(),
    page.click("text='Smoking Board Cedar Wood'"),
  ]);

  await expect(page).toHaveURL(/.*Smoking/);

  await page.click("[data-testid='add-to-cart-button']");

  await page.click("[data-testid='cart-button']");

  await expect(page.locator("ul[role='list']")).toBeVisible();
});
