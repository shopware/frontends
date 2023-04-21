import { expect, Locator, Page } from "@playwright/test";

export class SearchResultPage {
  readonly page: Page;
  readonly searchResultBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchResultBox = page.getByTestId("search-results-container");
  }
}
