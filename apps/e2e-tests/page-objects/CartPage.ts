import type { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly miniCartContainer: Locator;
  readonly miniCartButton: Locator;
  readonly removeMiniCart: Locator;
  readonly productOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.miniCartContainer = page.getByTestId("mini-cart-container");
    this.miniCartButton = page.getByTestId("header-mini-cart-button");
    this.removeMiniCart = page.getByTestId(
      "checkout-product-tile-remove-button",
    );
    this.productOption = page.getByTestId("cart-product-options");
  }

  async openMiniCart() {
    await this.miniCartButton.waitFor();
    await this.miniCartButton.click();
    await this.miniCartContainer.waitFor({ state: "visible" });
  }

  async removeFromMiniCart() {
    await this.page.waitForLoadState();
    await this.removeMiniCart.click();
  }
}
