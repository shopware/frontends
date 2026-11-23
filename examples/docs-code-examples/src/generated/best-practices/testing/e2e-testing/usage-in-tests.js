import { test, expect } from "@playwright/test";

test("failed login", async ({ page }) => {
  await page.goto("/account/login");

  await page.getByTestId("login-email-input").fill("test@shopware.com");
  await page.getByTestId("login-password-input").fill("Password123!@#");
  await page.getByTestId("login-submit-button").click();

  await expect(page.getByTestId("notification-element-danger")).toBeVisible();
});
