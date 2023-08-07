import { expect, Locator, Page } from "@playwright/test";

export class SearchResultPage {
  readonly page: Page;
  readonly searchResultBox: Locator;
  readonly selectedResultsFilter: Locator;
  readonly filterCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchResultBox = page.getByTestId("search-results-container");
    this.selectedResultsFilter = page.getByRole("button", {
      name: "manufacturer",
    });
    this.filterCheckbox = page.locator(
      "#filter-mobile-manufacturer-be02687c5d2542999cac9c4878621fa7",
    );
  }

  async selectSearchResultsFilter() {
    await this.page.waitForLoadState("networkidle");
    await this.selectedResultsFilter.click();
    await this.filterCheckbox.check();
  }
}
