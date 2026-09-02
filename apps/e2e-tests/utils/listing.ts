import { expect, type Locator, type Page } from "@playwright/test";

/** Property groups are sales channel content, so one is found by elimination. */
const NON_PROPERTY_FILTERS = [
  "Sort",
  "shipping-free",
  "rating",
  "price",
  "manufacturer",
  // Search listings only: filters on categories=, not properties=.
  "Categories",
];

const NON_FILTER_PREFIXES = ["Add to cart", "Page ", "Submit"];

const LISTING_TIMEOUT = 30000;

/**
 * Matched on the path: /search-suggest fires while typing and carries none of
 * the listing criteria. With `carrying`, only a request that applies that
 * filter resolves, so a query string that changed without the search changing
 * fails here instead of passing against the previous listing.
 */
function listingRequested(
  page: Page,
  carrying?: "manufacturer" | "properties",
) {
  return page.waitForResponse(
    (response) => {
      const path = new URL(response.url()).pathname;
      const isListing =
        path.endsWith("/store-api/search") ||
        path.includes("/store-api/product-listing/");
      if (!isListing || response.request().method() !== "POST") return false;
      if (!response.ok()) return false;
      if (!carrying) return true;

      let body: Record<string, unknown> = {};
      try {
        body = response.request().postDataJSON() ?? {};
      } catch {
        return false;
      }
      const applied = body[carrying];
      return Array.isArray(applied) ? applied.length > 0 : !!applied;
    },
    { timeout: LISTING_TIMEOUT },
  );
}

async function listingRendered(page: Page) {
  await expect(page.getByTestId("loading")).toHaveCount(0, {
    timeout: LISTING_TIMEOUT,
  });
  await page
    .getByTestId("product-box-img")
    .first()
    .waitFor({ state: "visible", timeout: LISTING_TIMEOUT });
}

/** Options are unlabelled, so one is taken by position in the panel. */
export async function checkFirstOptionIn(
  page: Page,
  panel: Locator,
  filterKey: "manufacturer" | "properties",
) {
  const checkboxes = page.locator('input[type="checkbox"]');
  const before = await checkboxes.count();

  await panel.click();
  await checkboxes.nth(before).waitFor({ state: "attached" });

  // Armed first: the request leaves as soon as the box is ticked.
  const listed = listingRequested(page, filterKey);
  await checkboxes.nth(before).check({ force: true });
  try {
    await listed;
  } catch {
    throw new Error(
      `The ${filterKey} filter produced no successful listing request carrying it within ${LISTING_TIMEOUT}ms.`,
    );
  }

  await listingRendered(page);
}

export async function firstPropertyFilter(page: Page) {
  // The rail renders after the listing.
  await page
    .getByRole("button", { name: "manufacturer", exact: true })
    .waitFor({ state: "visible" });

  const buttons = page.getByRole("button");
  const names = await buttons.evaluateAll((elements) =>
    elements.map((element) => element.textContent?.trim() ?? ""),
  );

  const index = names.findIndex(
    (name) =>
      name.length > 0 &&
      !NON_PROPERTY_FILTERS.includes(name) &&
      !NON_FILTER_PREFIXES.some((prefix) => name.startsWith(prefix)),
  );
  if (index === -1) {
    throw new Error(
      `No property filter on this listing. Buttons seen: ${names.filter(Boolean).join(", ")}.`,
    );
  }

  return buttons.nth(index);
}

/** Sort menus render as a menu of menuitems, not a native select. */
export async function sortBy(page: Page, label: string) {
  await page.getByRole("button", { name: "Sort" }).click();
  const entry = page
    .locator('[role="menu"] [role="menuitem"]')
    .filter({ hasText: label });

  const listed = listingRequested(page);
  await entry.click();
  try {
    await listed;
  } catch {
    throw new Error(
      `Sorting by "${label}" sent no successful listing request within ${LISTING_TIMEOUT}ms.`,
    );
  }
  await listingRendered(page);
}

// The URL is pushed before the request starts, so both helpers below assert on
// the result changing rather than on the URL.
export async function applyLimit(page: Page, limitSelect: Locator) {
  await limitSelect.selectOption({ value: "1" });
  await page.waitForURL(/limit=1/);
  await listingRendered(page);
  await expect(page.getByTestId("product-box-img")).toHaveCount(1, {
    timeout: LISTING_TIMEOUT,
  });
}

export async function goToPage(page: Page, number: number) {
  const firstProduct = page
    .getByTestId("product-box-product-name-link")
    .first();
  const before = await firstProduct.getAttribute("href");

  await page.getByRole("button", { name: `Page ${number}` }).click();
  await page.waitForURL(new RegExp(`p=${number}`));
  await listingRendered(page);
  await expect(firstProduct).not.toHaveAttribute("href", before ?? "", {
    timeout: LISTING_TIMEOUT,
  });
}
