import { expect, Locator, Page } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator("[data-testid='add-to-cart-button']");
  }

  async addToCart() {
    await Promise.all([
      this.page.waitForLoadState("load"),
      this.addToCartButton.click(),
    ]);
  }
}
