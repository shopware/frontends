import { expect, Locator, Page } from "@playwright/test";

export class CategoryPage {
  readonly page: Page;
  readonly selectedFiltersCategory: Locator;
  readonly filterCheckbox: Locator;
  readonly productBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.selectedFiltersCategory = page.getByRole("button", {
      name: "Colour",
      exact: true,
    });
    this.filterCheckbox = page
      .locator("div")
      .filter({ hasText: /^Clear White$/ })
      .getByRole("checkbox");
    this.productBox = page.getByTestId("product-box-img");
  }

  async selectFilter() {
    await this.page.waitForLoadState("networkidle");
    await this.selectedFiltersCategory.click();
    await this.filterCheckbox.check();
  }
}
