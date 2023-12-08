import { expect, Locator, Page } from "@playwright/test";

export class CategoryPage {
  readonly page: Page;
  readonly selectedColourFiltersCategory: Locator;
  readonly selectedManufacturerFiltersCategory: Locator;
  readonly filterCheckbox: Locator;
  readonly productBox: Locator;
  readonly manufacturerCheckboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.selectedColourFiltersCategory = page.getByRole("button", {
      name: "Colour",
      exact: true,
    });
    this.filterCheckbox = page
      .locator("div")
      .filter({ hasText: /^Clear White$/ })
      .getByRole("checkbox");
    this.productBox = page.getByTestId("product-box-img");

    this.selectedManufacturerFiltersCategory = page.getByRole("button", {
      name: "manufacturer",
      exact: true,
    });
    this.manufacturerCheckboxes = page.locator("input[name='manufacturer']");
  }

  async selectRandomManufacturerCheckbox() {
    await this.page.waitForLoadState("networkidle");
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

  async selectFilter() {
    await this.page.waitForLoadState("networkidle");
    await this.selectedColourFiltersCategory.click();
    await this.filterCheckbox.check();
  }
}
