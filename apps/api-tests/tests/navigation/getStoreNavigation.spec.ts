import { test, expect } from "@playwright/test";

test.describe("fetch main navigation", () => {
  test("with seo urls", async ({ request }) => {
    const mainNavigation = await request.post(
      `/store-api/navigation/main-navigation/main-navigation`,
      {
        headers: {
          "sw-include-seo-urls": "true",
        },
      },
    );

    expect(mainNavigation.ok()).toBeTruthy();
  });

  test("fetch main navigation without seo urls", async ({ request }) => {
    const mainNavigation = await request.post(
      `/store-api/navigation/main-navigation/main-navigation`,
    );

    expect(mainNavigation.ok()).toBeTruthy();
  });
});
