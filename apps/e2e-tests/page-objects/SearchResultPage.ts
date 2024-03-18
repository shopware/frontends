import { Locator, Page } from "@playwright/test";

export class SearchResultPage {
  readonly page: Page;
  readonly searchResultBox: Locator;
  readonly selectedManufacturerFilterSearch: Locator;
  readonly manufacturerCheckboxes: Locator;
  readonly selectedSelectionFilterSearch: Locator;
  readonly selectionCheckboxes: Locator;
  readonly limitSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchResultBox = page.getByTestId("search-results-container");
    this.selectedManufacturerFilterSearch = page.getByRole("button", {
      name: "manufacturer",
      exact: true,
    });
    this.manufacturerCheckboxes = page.locator("input[name='manufacturer']");
    this.selectedSelectionFilterSearch = page.getByRole("button", {
      name: "Selection",
      exact: true,
    });
    this.selectionCheckboxes = page.locator("input[name='Selection']");
    this.limitSelect = page.locator("select[name='limitchoices']");
  }

  async selectRandomManufacturerCheckbox() {
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

  async selectLimitOneProductPerPage() {
    await this.limitSelect.selectOption({ value: "1" });
  }

  async goToSecondPage() {
    await this.page.getByRole("button", { name: /2/i }).click();
  }

  async selectSortingPriceAsc() {
    await this.page.getByRole("button", { name: "Sort" }).click();
    await this.page.getByRole("menuitem", { name: "Price ascending" }).click();
  }
}
