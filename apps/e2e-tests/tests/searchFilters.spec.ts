import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Filters on the product search page (vue-starter-template, issue #2250).
 *
 * Targets a locally running starter template:
 *   cd templates/vue-starter-template && pnpm dev      # serves on :3000
 *   BASE_E2E_URL=http://localhost:3000 pnpm exec playwright test \
 *     tests/searchFilters.spec.ts --project=chromium --workers=1
 *
 * "chair" is used because the demo catalog (furniture) returns multiple
 * products across several manufacturers and a wide price range for it.
 */

const SEARCH_TERM = "chair";
const productCards = "product-box-img";

const openSearch = async (page: Page, query: string) => {
  await page.goto(`/search?${query}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await expect(page.getByTestId("search-results-container")).toBeVisible();
  await expect(page.getByTestId("loading")).toHaveCount(0);
};

test.describe("Search page filters", { tag: "@vue-starter-template" }, () => {
  test.beforeEach(async ({ page }) => {
    await openSearch(page, `search=${SEARCH_TERM}`);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBeGreaterThan(0);
  });

  test("renders the filter sidebar with a manufacturer group", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: "manufacturer", exact: true }),
    ).toBeVisible();
  });

  test("applying a manufacturer filter narrows results and keeps the search term", async ({
    page,
  }) => {
    const before = await page.getByTestId(productCards).count();

    await page
      .getByRole("button", { name: "manufacturer", exact: true })
      .click();
    await page.locator("#manufacturer").getByRole("checkbox").first().check();

    // The selected manufacturer lands in the URL...
    await expect(page).toHaveURL(/manufacturer=/);
    // ...and the search term is NOT dropped (the core fix).
    await expect(page).toHaveURL(/search=chair/);

    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBeLessThan(before);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBeGreaterThan(0);
  });

  test("filters survive a reload (deep link / SSR)", async ({ page }) => {
    await page
      .getByRole("button", { name: "manufacturer", exact: true })
      .click();
    await page.locator("#manufacturer").getByRole("checkbox").first().check();
    await expect(page).toHaveURL(/manufacturer=/);
    await expect(page.getByTestId("loading")).toHaveCount(0);

    const filteredCount = await page.getByTestId(productCards).count();
    const filteredUrl = page.url();

    await page.reload({ waitUntil: "domcontentloaded" });

    expect(page.url()).toBe(filteredUrl);
    await expect(page).toHaveURL(/search=chair/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBe(filteredCount);

    // The applied filter is reflected back in the (re-hydrated) sidebar.
    await page
      .getByRole("button", { name: "manufacturer", exact: true })
      .click();
    await expect(
      page.locator("#manufacturer").getByRole("checkbox", { checked: true }),
    ).toHaveCount(1);
  });

  test("reset filters clears facets but keeps the search term", async ({
    page,
  }) => {
    const before = await page.getByTestId(productCards).count();

    await page
      .getByRole("button", { name: "manufacturer", exact: true })
      .click();
    await page.locator("#manufacturer").getByRole("checkbox").first().check();
    await expect(page).toHaveURL(/manufacturer=/);
    await expect(page.getByTestId("loading")).toHaveCount(0);

    await page.getByRole("button", { name: "Reset filters" }).click();

    await expect(page).not.toHaveURL(/manufacturer=/);
    await expect(page).toHaveURL(/search=chair/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBe(before);
  });

  test("a numeric price filter from a deep link narrows results", async ({
    page,
  }) => {
    const before = await page.getByTestId(productCards).count();

    await openSearch(page, `search=${SEARCH_TERM}&min-price=800`);

    await expect(page).toHaveURL(/search=chair/);
    await expect(page).toHaveURL(/min-price=800/);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBeLessThan(before);
  });
});
