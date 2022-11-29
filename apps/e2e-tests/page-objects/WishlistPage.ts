import { expect, Locator, Page } from "@playwright/test";

export class WishlistPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly wishlistButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator("[data-testid='add-to-cart-button']");
    this.wishlistButton = page.locator("[data-testid='wishlist-button']")

  }

  async openWishlist() {
    await Promise.all([
      this.page.waitForLoadState("load"),
      this.wishlistButton.click(),
    ]);
  }
}
