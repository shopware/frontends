import { expect, type Locator, type Page } from "@playwright/test";

import { LISTING_TIMEOUT } from "../utils/listing";

// Filter codes, matched against the panel's data-testid rather than its button
// text, which is localised. Anything not in here is a property group.
const NON_PROPERTY_FILTER_CODES = [
  "manufacturer",
  "price",
  "rating",
  "shipping-free",
  // Search listings only: filters on categories=, not properties=.
  "categories",
];

/** Shared by the category and search listings, which behave identically. */
export abstract class ListingPage {
  readonly page: Page;
  readonly manufacturerFilter: Locator;
  readonly limitSelect: Locator;
  readonly loading: Locator;
  readonly productImages: Locator;
  /** Its data-* attributes echo the listing response, not the URL. */
  readonly results: Locator;

  constructor(page: Page) {
    this.page = page;
    this.results = page
      .getByTestId("listing-results")
      .filter({ visible: true });
    this.manufacturerFilter = page
      .getByTestId("listing-filter-manufacturer")
      .filter({ visible: true });
    this.limitSelect = page
      .getByTestId("listing-pagination-limit-select")
      .filter({ visible: true });
    this.loading = page.getByTestId("loading");
    this.productImages = page.getByTestId("product-box-img");
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
    await this.sortBy("price-asc");
  }

  async selectLimitOneProductPerPage() {
    await this.limitSelect.selectOption({ value: "1" });
    await this.page.waitForURL(/limit=1/);
    await this.rendered();
    await expect(
      this.page.getByTestId("product-box-img").filter({ visible: true }),
    ).toHaveCount(1, {
      timeout: LISTING_TIMEOUT,
    });
  }

  async goToPage(number: number) {
    const firstProduct = this.page
      .getByTestId("product-box-product-name-link")
      .filter({ visible: true })
      .first();
    const before = await firstProduct.getAttribute("href");

    await this.page
      .locator(
        `[data-testid="listing-pagination-page-button"][data-page="${number}"]`,
      )
      .filter({ visible: true })
      .click();
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
    // Scoped to the panel: a page-wide index would shift if the rail closes
    // another panel, or if anything else on the page adds a checkbox.
    const option = panel.locator('input[type="checkbox"]').first();

    await panel.getByRole("button").first().click();
    await option.waitFor({ state: "attached" });

    await option.check({ force: true });

    await this.page.waitForURL((url) => !!url.searchParams.get(filterKey), {
      timeout: LISTING_TIMEOUT,
    });
    const requested =
      new URL(this.page.url()).searchParams.get(filterKey) ?? "";
    await expect(
      this.results,
      `The listing response did not apply the ${filterKey} filter from the URL.`,
    ).toHaveAttribute(`data-${filterKey}`, requested, {
      timeout: LISTING_TIMEOUT,
    });

    await this.rendered();
  }

  protected async firstPropertyFilter() {
    // The rail renders after the listing.
    await this.manufacturerFilter.waitFor({ state: "visible" });

    const panels = this.page
      .locator('[data-testid^="listing-filter-"]')
      .filter({ visible: true });
    const codes = await panels.evaluateAll((elements) =>
      elements.map((element) =>
        (element.getAttribute("data-testid") ?? "").replace(
          "listing-filter-",
          "",
        ),
      ),
    );

    const index = codes.findIndex(
      (code) => code.length > 0 && !NON_PROPERTY_FILTER_CODES.includes(code),
    );
    if (index === -1) {
      throw new Error(
        `No property filter on this listing. Filter codes seen: ${codes.join(", ")}.`,
      );
    }

    return panels.nth(index);
  }

  protected async sortBy(sortKey: string) {
    const button = this.page.getByTestId("listing-sort-button");
    await button.click();
    // Scoped to the visible button: the closed menu's options are hidden.
    const entry = button
      .locator("..")
      .locator(
        `[data-testid="listing-sort-option"][data-sort-key="${sortKey}"]`,
      );

    await entry.click();
    await expect(
      this.results,
      `The listing response is not sorted by "${sortKey}".`,
    ).toHaveAttribute("data-sorting", sortKey, { timeout: LISTING_TIMEOUT });
    await this.rendered();
    await expect(entry).toHaveAttribute("data-selected", "true");
    await expect(entry).toHaveAttribute("aria-checked", "true");
  }

  /** The URL is pushed before the request starts, so wait for the result. */
  protected async rendered() {
    await expect(
      this.page.getByTestId("loading").filter({ visible: true }),
    ).toHaveCount(0, {
      timeout: LISTING_TIMEOUT,
    });
    await this.page
      .getByTestId("product-box-img")
      .filter({ visible: true })
      .first()
      .waitFor({ state: "visible", timeout: LISTING_TIMEOUT });
  }
}
