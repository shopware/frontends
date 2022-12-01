import { expect, Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly goToCheckoutButton: Locator;
  readonly placeOrderButton: Locator;
  readonly loginOnCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToCheckoutButton = page.locator(
      "[data-testid='cart-checkout-link']"
    );
    this.placeOrderButton = page.locator(
      "[data-testid='checkout-place-order-button']"
    );
    this.loginOnCheckoutButton = page.locator(
      "[data-testid='checkout-sign-in-link']"
    );
  }

  async goToCheckout() {
    await this.page.waitForSelector("[data-testid='cart-product-image']");
    await this.goToCheckoutButton.click();
  }

  async placeOrder() {
    await this.page.waitForLoadState();
    await this.placeOrderButton.click();
  }

  async loginOnCheckout() {
    await this.page.waitForLoadState();
    await this.loginOnCheckoutButton.click();
  }
}
