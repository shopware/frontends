import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly miniCartContainer: Locator;
  readonly miniCartButton: Locator;
  readonly lineItemImages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.miniCartContainer = page.getByTestId("mini-cart-container");
    this.miniCartButton = page.getByTestId("header-mini-cart-button");
    this.lineItemImages = page.getByTestId("checkout-product-tile-image");
  }

  async openMiniCart() {
    await this.miniCartButton.waitFor();
    await this.miniCartButton.click();
    await this.miniCartContainer.waitFor({ state: "visible" });
  }
}
