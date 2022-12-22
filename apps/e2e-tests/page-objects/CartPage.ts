import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly miniCartLink: Locator;
  readonly removeMiniCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.miniCartLink = page.locator("[data-testid='cart-button']");
    this.removeMiniCart = page.locator("[data-testid='product-remove-button']");
  }

  async openMiniCart() {
    await this.page.waitForLoadState(), await this.miniCartLink.click();
  }

  async removeFromMiniCart() {
    await this.page.waitForLoadState(), await this.removeMiniCart.click();
  }
}
