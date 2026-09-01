import { expect, type Locator, type Page } from "@playwright/test";

/**
 * Which property groups exist is sales channel content ("Colour" vs "Finish"),
 * so a property filter is found by elimination rather than by name.
 */
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

/** Filter options are unlabelled, so one is taken by position in the panel. */
export async function checkFirstOptionIn(page: Page, panel: Locator) {
  const checkboxes = page.locator('input[type="checkbox"]');
  const before = await checkboxes.count();

  await panel.click();
  await checkboxes.nth(before).waitFor({ state: "attached" });
  await checkboxes.nth(before).check({ force: true });
}

/** The first filter panel that is a product property group. */
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
  await page
    .locator('[role="menu"] [role="menuitem"]')
    .filter({ hasText: label })
    .click();
}

/**
 * The URL is pushed before the request starts, so the old listing is still on
 * screen once it matches. Both helpers below wait for the result to change
 * rather than for the URL, which would let a test race ahead of the response.
 */
export async function applyLimit(page: Page, limitSelect: Locator) {
  await limitSelect.selectOption({ value: "1" });
  await page.waitForURL(/limit=1/);
  await expect(page.getByTestId("product-box-img")).toHaveCount(1);
}

export async function goToPage(page: Page, number: number) {
  const firstProduct = page
    .getByTestId("product-box-product-name-link")
    .first();
  const before = await firstProduct.getAttribute("href");

  await page.getByRole("button", { name: `Page ${number}` }).click();
  await page.waitForURL(new RegExp(`p=${number}`));
  await expect(firstProduct).not.toHaveAttribute("href", before ?? "");
}
