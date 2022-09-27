import { expect, Locator, Page } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator("[data-testid='add-to-cart-button']");
  }

  async addToCart() {
    await await this.addToCartButton.click();
  }
}
