import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/**
 * Filters on the product search page (vue-starter-template, issue #2250).
 *
 * Run a starter template first, then:
 *   BASE_E2E_URL=http://localhost:3000 \
 *     pnpm exec playwright test -c starter.config.ts
 *
 * SEARCH_TERM defaults to "chair" (the demo catalog is furniture, which
 * returns several products across multiple manufacturers and a wide price
 * range). Override it when pointing at a different catalog:
 *   SEARCH_TERM=shirt BASE_E2E_URL=... pnpm exec playwright test -c starter.config.ts
 */

const SEARCH_TERM = process.env.SEARCH_TERM || "chair";
const productCards = "product-box-img";

const manufacturerButton = (page: Page) =>
  page.getByRole("button", { name: "manufacturer", exact: true });

// The starter shows a one-time "Guided setup" banner; dismiss it if present.
const dismissBanner = async (page: Page) => {
  await page
    .getByRole("button", { name: "Close banner" })
    .click({ timeout: 3000 })
    .catch(() => {});
};

const openSearch = async (page: Page, query: string) => {
  await page.goto(`/search?${query}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await expect(page.getByTestId("search-results-container")).toBeVisible();
  await dismissBanner(page);
  await expect(page.getByTestId("loading")).toHaveCount(0);
  await expect
    .poll(() => page.getByTestId(productCards).count())
    .toBeGreaterThan(0);
};

// Expand the manufacturer accordion and return its first option checkbox.
const expandManufacturer = async (page: Page) => {
  await expect(manufacturerButton(page)).toBeVisible();
  await manufacturerButton(page).click();
  const firstOption = page
    .locator("#manufacturer")
    .getByRole("checkbox")
    .first();
  await expect(firstOption).toBeVisible();
  return firstOption;
};

test.describe("Search page filters", { tag: "@vue-starter-template" }, () => {
  test.beforeEach(async ({ page }) => {
    await openSearch(page, `search=${SEARCH_TERM}`);
  });

  test("renders the filter sidebar with a manufacturer group", async ({
    page,
  }) => {
    await expect(manufacturerButton(page)).toBeVisible();
  });

  test("applying a manufacturer filter narrows results and keeps the search term", async ({
    page,
  }) => {
    const before = await page.getByTestId(productCards).count();

    const option = await expandManufacturer(page);
    await option.check();

    // The selected manufacturer lands in the URL...
    await expect(page).toHaveURL(/manufacturer=/);
    // ...and the search term is NOT dropped (the core fix).
    await expect(page).toHaveURL(new RegExp(`search=${SEARCH_TERM}`));

    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBeLessThan(before);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBeGreaterThan(0);
  });

  test("filters survive a reload (deep link / SSR)", async ({ page }) => {
    const option = await expandManufacturer(page);
    await option.check();
    await expect(page).toHaveURL(/manufacturer=/);
    await expect(page.getByTestId("loading")).toHaveCount(0);

    const filteredCount = await page.getByTestId(productCards).count();
    const filteredUrl = page.url();

    await page.reload({ waitUntil: "domcontentloaded" });
    await dismissBanner(page);

    expect(page.url()).toBe(filteredUrl);
    await expect(page).toHaveURL(new RegExp(`search=${SEARCH_TERM}`));
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBe(filteredCount);

    // The applied filter is reflected back in the (re-hydrated) sidebar.
    await manufacturerButton(page).click();
    await expect(
      page.locator("#manufacturer").getByRole("checkbox", { checked: true }),
    ).toHaveCount(1);
  });

  test("reset filters clears facets but keeps the search term", async ({
    page,
  }) => {
    const before = await page.getByTestId(productCards).count();

    const option = await expandManufacturer(page);
    await option.check();
    await expect(page).toHaveURL(/manufacturer=/);
    await expect(page.getByTestId("loading")).toHaveCount(0);

    await page.getByRole("button", { name: "Reset filters" }).click();

    await expect(page).not.toHaveURL(/manufacturer=/);
    await expect(page).toHaveURL(new RegExp(`search=${SEARCH_TERM}`));
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

    await expect(page).toHaveURL(new RegExp(`search=${SEARCH_TERM}`));
    await expect(page).toHaveURL(/min-price=800/);
    await expect
      .poll(() => page.getByTestId(productCards).count())
      .toBeLessThan(before);
  });
});
