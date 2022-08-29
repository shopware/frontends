import { test, expect } from "@playwright/test";

test("failed login", async ({ page }) => {
  await page.goto("/");

  await page.click("[data-testid='header-sign-in-link']"),
    await page
      .locator("[data-testid='login-email-input']")
      .fill("test@shopware.com");
  await page
    .locator("[data-testid='login-password-input']")
    .fill("Password123!@#");

  await Promise.all([await page.click("[data-testid='login-submit-button']")]);

  await expect(
    page.locator("[data-testid='login-errors-container']")
  ).toBeVisible();
});
