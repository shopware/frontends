import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly miniCartLink: Locator;
  readonly removeMiniCart: Locator;
  readonly productOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.miniCartLink = page.getByTestId("cart-button");
    this.removeMiniCart = page.getByTestId("product-remove-button");
    this.productOption = page.getByTestId("cart-product-options");
  }

  async openMiniCart() {
    await this.page.waitForLoadState();
    await this.miniCartLink.click();
  }

  async removeFromMiniCart() {
    await this.page.waitForLoadState();
    await this.removeMiniCart.click();
  }
}
