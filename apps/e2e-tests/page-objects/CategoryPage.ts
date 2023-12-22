import { Locator, Page } from "@playwright/test";

export class CategoryPage {
  readonly page: Page;
  readonly selectedColourFiltersCategory: Locator;
  readonly colourCheckboxes: Locator;
  readonly selectedManufacturerFiltersCategory: Locator;
  readonly manufacturerCheckboxes: Locator;

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

  async selectRandomColorCheckbox() {
    await this.page.waitForLoadState("networkidle");
    await this.selectedColourFiltersCategory.click();
    const colourCheckboxes = await this.colourCheckboxes.all();
    const countColourCheckboxes = (await this.colourCheckboxes.all()).length;
    const randomCheckboxSelctor = Math.floor(
      Math.random() * countColourCheckboxes,
    );
    const randomCheckbox = colourCheckboxes[randomCheckboxSelctor];
    await randomCheckbox.check();
  }
}
