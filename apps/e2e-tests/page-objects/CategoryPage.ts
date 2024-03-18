import { Locator, Page } from "@playwright/test";

export class CategoryPage {
  readonly page: Page;
  readonly selectedColourFiltersCategory: Locator;
  readonly colourCheckboxes: Locator;
  readonly selectedManufacturerFiltersCategory: Locator;
  readonly manufacturerCheckboxes: Locator;
  readonly limitSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.selectedColourFiltersCategory = page.getByRole("button", {
      name: "Colour",
      exact: true,
    });
    this.colourCheckboxes = page.locator("input[name='Colour']");
    this.selectedManufacturerFiltersCategory = page.getByRole("button", {
      name: "manufacturer",
      exact: true,
    });
    this.manufacturerCheckboxes = page.locator("input[name='manufacturer']");
    this.limitSelect = page.locator("select[name='limitchoices']");
  }

  async selectRandomManufacturerCheckbox() {
    await this.selectedManufacturerFiltersCategory.click();
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

  async selectRandomColorCheckbox() {
    await this.selectedColourFiltersCategory.click();
    const colourCheckboxes = await this.colourCheckboxes.all();
    const countColourCheckboxes = (await this.colourCheckboxes.all()).length;
    const randomCheckboxSelctor = Math.floor(
      Math.random() * countColourCheckboxes,
    );
    const randomCheckbox = colourCheckboxes[randomCheckboxSelctor];
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
