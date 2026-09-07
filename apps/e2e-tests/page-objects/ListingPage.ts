import { expect, type Locator, type Page } from "@playwright/test";

import { LISTING_TIMEOUT, listingRequested } from "../utils/listing";

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

/** Shared by the category and search listings, which behave identically. */
export abstract class ListingPage {
  readonly page: Page;
  readonly manufacturerFilter: Locator;
  readonly limitSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.manufacturerFilter = page.getByRole("button", {
      name: "manufacturer",
      exact: true,
    });
    this.limitSelect = page.getByTestId("listing-pagination-limit-select");
  }

  async selectRandomManufacturerCheckbox() {
    await this.checkFirstOptionIn(this.manufacturerFilter, "manufacturer");
  }

  async selectRandomPropertyCheckbox() {
    await this.checkFirstOptionIn(
      await this.firstPropertyFilter(),
      "properties",
    );
  }

  async selectSortingPriceAsc() {
    await this.sortBy("Price ascending");
  }

  async selectLimitOneProductPerPage() {
    await this.limitSelect.selectOption({ value: "1" });
    await this.page.waitForURL(/limit=1/);
    await this.rendered();
    await expect(this.page.getByTestId("product-box-img")).toHaveCount(1, {
      timeout: LISTING_TIMEOUT,
    });
  }

  async goToPage(number: number) {
    const firstProduct = this.page
      .getByTestId("product-box-product-name-link")
      .first();
    const before = await firstProduct.getAttribute("href");

    await this.page.getByRole("button", { name: `Page ${number}` }).click();
    await this.page.waitForURL(new RegExp(`p=${number}`));
    await this.rendered();
    await expect(firstProduct).not.toHaveAttribute("href", before ?? "", {
      timeout: LISTING_TIMEOUT,
    });
  }

  async goToSecondPage() {
    await this.goToPage(2);
  }

  /** Options are unlabelled, so one is taken by position in the panel. */
  protected async checkFirstOptionIn(
    panel: Locator,
    filterKey: "manufacturer" | "properties",
  ) {
    const checkboxes = this.page.locator('input[type="checkbox"]');
    const before = await checkboxes.count();

    await panel.click();
    await checkboxes.nth(before).waitFor({ state: "attached" });

    // Armed first: the request leaves as soon as the box is ticked.
    const listed = listingRequested(this.page, filterKey);
    await checkboxes.nth(before).check({ force: true });
    try {
      await listed;
    } catch {
      throw new Error(
        `The ${filterKey} filter produced no successful listing request carrying it within ${LISTING_TIMEOUT}ms.`,
      );
    }

    await this.rendered();
  }

  protected async firstPropertyFilter() {
    // The rail renders after the listing.
    await this.manufacturerFilter.waitFor({ state: "visible" });

    const buttons = this.page.getByRole("button");
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
  protected async sortBy(label: string) {
    await this.page.getByRole("button", { name: "Sort" }).click();
    const entry = this.page
      .locator('[role="menu"] [role="menuitem"]')
      .filter({ hasText: label });

    const listed = listingRequested(this.page);
    await entry.click();
    try {
      await listed;
    } catch {
      throw new Error(
        `Sorting by "${label}" sent no successful listing request within ${LISTING_TIMEOUT}ms.`,
      );
    }
    await this.rendered();
  }

  /** The URL is pushed before the request starts, so wait for the result. */
  protected async rendered() {
    await expect(this.page.getByTestId("loading")).toHaveCount(0, {
      timeout: LISTING_TIMEOUT,
    });
    await this.page
      .getByTestId("product-box-img")
      .first()
      .waitFor({ state: "visible", timeout: LISTING_TIMEOUT });
  }
}
