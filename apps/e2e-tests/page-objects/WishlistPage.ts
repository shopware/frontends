import { expect, Locator, Page } from "@playwright/test";

export class WishlistPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly wishlistButton: Locator;
  readonly productInWishlistButton: Locator;
  readonly clearWishlistButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByTestId("add-to-cart-button");
    this.wishlistButton = page.getByTestId("wishlist-button");
    this.productInWishlistButton = page
      .getByTestId("product-box-toggle-wishlist-button")
      .first();
    this.clearWishlistButton = page.getByTestId("clear-wishlist-button");
  }

  async openWishlist() {
    await this.wishlistButton.click();
  }

  async removeProductFromWishlist() {
    await this.page.waitForLoadState("networkidle");
    await this.productInWishlistButton.click();
  }

  async clearWishlist() {
    await this.page.waitForLoadState("networkidle");
    await this.clearWishlistButton.click();
  }
}
