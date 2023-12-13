import { Locator, Page } from "@playwright/test";

export class SearchResultPage {
  readonly page: Page;
  readonly searchResultBox: Locator;
  readonly selectedManufacturerFilterSearch: Locator;
  readonly manufacturerCheckboxes: Locator;
  readonly selectedSelectionFilterSearch: Locator;
  readonly selectionCheckboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchResultBox = page.getByTestId("search-results-container");
    this.selectedSelectionFilterSearch = page.getByRole("button", {
      name: "Selection",
      exact: true,
    });
    this.selectionCheckboxes = page.locator("input[name='Selection']");
    this.selectedManufacturerFilterSearch = page.getByRole("button", {
      name: "manufacturer",
      exact: true,
    });
    this.manufacturerCheckboxes = page.locator("input[name='manufacturer']");
  }

  async selectRandomManufacturerCheckbox() {
    await this.page.waitForLoadState("networkidle");
    await this.selectedManufacturerFilterSearch.click();
    const manufacturerCheckboxes = await this.manufacturerCheckboxes.all();
    const countManufacturerCheckboxes = (
      await this.manufacturerCheckboxes.all()
    ).length;
    const randomCheckboxSelctor = Math.floor(
      Math.random() * countManufacturerCheckboxes,
    );
    const randomCheckbox = manufacturerCheckboxes[randomCheckboxSelctor];
    await randomCheckbox.check();
  }

  async selectRandomSelectionCheckbox() {
    await this.page.waitForLoadState("networkidle");
    await this.selectedSelectionFilterSearch.click();
    const selectionCheckboxes = await this.selectionCheckboxes.all();
    const countSelectionCheckboxes = (await this.selectionCheckboxes.all())
      .length;
    const randomCheckboxSelctor = Math.floor(
      Math.random() * countSelectionCheckboxes,
    );
    const randomCheckbox = selectionCheckboxes[randomCheckboxSelctor];
    await randomCheckbox.check();
  }
}
