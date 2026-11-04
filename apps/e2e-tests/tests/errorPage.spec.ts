import { expect, MOCKED_STORE_API, test } from "../fixtures";

test.describe("Error page", { tag: "@frontends" }, () => {
  test("Unknown URL renders the 404 page", async ({ page }) => {
    const response = await page.goto(`/this-page-does-not-exist-${Date.now()}`);

    expect(response?.status()).toBe(404);
    const errorPage = page.getByTestId("error-page");
    await expect(errorPage).toBeVisible();
    await expect(errorPage.locator("h1")).toContainText("404");

    await page.getByTestId("error-page-home-button").click();
    await expect(page).toHaveURL((url) => url.pathname === "/");
    await expect(errorPage).toHaveCount(0);
  });

  test(
    "Maintenance mode renders the maintenance page",
    { annotation: MOCKED_STORE_API },
    async ({ page }) => {
      await page.route("**/store-api/**", (route) =>
        route.fulfill({
          status: 503,
          json: {
            errors: [
              {
                status: "503",
                code: "FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE",
                detail: "The sales channel is in maintenance mode.",
              },
            ],
          },
        }),
      );
      // Rendered in the browser (ssr: false), so the mock sees every call.
      await page.goto("/account/login");

      await expect(page.getByTestId("maintenance-page")).toBeVisible();
      await expect(page.getByTestId("error-page")).toHaveCount(0);
    },
  );
});
