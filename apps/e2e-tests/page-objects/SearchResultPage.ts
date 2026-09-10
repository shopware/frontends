import type { Page } from "@playwright/test";

import { ListingPage } from "./ListingPage";

export class SearchResultPage extends ListingPage {
  readonly searchResultBox;

  constructor(page: Page) {
    super(page);
    this.searchResultBox = page.getByTestId("search-results-container");
  }

  async selectRandomSelectionCheckbox() {
    await this.selectRandomPropertyCheckbox();
  }
}
