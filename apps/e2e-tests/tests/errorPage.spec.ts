import { expect, test } from "../fixtures";

test.describe("Error page", { tag: "@frontends" }, () => {
  test("Unknown URL renders the 404 page", async ({ page }) => {
    const response = await page.goto(`/this-page-does-not-exist-${Date.now()}`);

    expect(response?.status()).toBe(404);
    await expect(page.getByTestId("error-page")).toBeVisible();
    await expect(page.locator("h1")).toHaveText("404");
    await expect(page.getByTestId("error-page-home-button")).toBeVisible();
  });
});
