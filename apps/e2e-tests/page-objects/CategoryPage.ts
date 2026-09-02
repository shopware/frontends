import type { Locator, Page } from "@playwright/test";

import {
  applyLimit,
  checkFirstOptionIn,
  firstPropertyFilter,
  goToPage,
  sortBy,
} from "../utils/listing";

export class CategoryPage {
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
    await checkFirstOptionIn(
      this.page,
      this.manufacturerFilter,
      "manufacturer",
    );
  }

  async selectRandomColorCheckbox() {
    await checkFirstOptionIn(
      this.page,
      await firstPropertyFilter(this.page),
      "properties",
    );
  }

  async selectLimitOneProductPerPage() {
    await applyLimit(this.page, this.limitSelect);
  }

  async goToSecondPage() {
    await goToPage(this.page, 2);
  }

  async selectSortingPriceAsc() {
    await sortBy(this.page, "Price ascending");
  }
}
