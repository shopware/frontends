import { expect, Locator, Page } from "@playwright/test";

export class WishlistPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly wishlistButton: Locator;
  readonly productInWishlistButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByTestId("add-to-cart-button");
    this.wishlistButton = page.getByTestId("wishlist-button");
    this.productInWishlistButton = page.getByTestId(
      "product-box-wishlist-icon"
    );
  }

  async openWishlist() {
    await this.page.waitForLoadState(), await this.wishlistButton.click();
  }

  async removeProductFromWishlist() {
    await this.productInWishlistButton.click();
    await this.page.waitForLoadState("networkidle");
  }
}
