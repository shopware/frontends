import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly miniCartContainer: Locator;
  readonly miniCartLink: Locator;
  readonly removeMiniCart: Locator;
  readonly productOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.miniCartContainer = page.getByTestId("sidebar-right");
    this.miniCartLink = page.getByTestId("cart-button");
    this.removeMiniCart = page.getByTestId("product-remove-button");
    this.productOption = page.getByTestId("cart-product-options");
  }

  async openMiniCart() {
    await this.miniCartLink.waitFor();
    await this.miniCartLink.click({
      timeout: 1000,
    });
    await this.miniCartContainer.isVisible();
  }

  async removeFromMiniCart() {
    await this.page.waitForLoadState();
    await this.removeMiniCart.click();
  }
}
