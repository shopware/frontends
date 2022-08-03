import { test, expect } from "@playwright/test";

test("add product to cart*", async ({ page }) => {
  await page.goto("/");

  await page.locator("text= Smoking Board Cedar Wood ").click();

  await expect(page).toHaveURL(/.*Smoking/);

  await page.locator("text= Add to bag").click();

  await page
    .locator("button[class='group -m-2 p-2 flex items-center']")
    .click();

  await expect(page.locator("ul[role='list']")).toBeVisible();
});
