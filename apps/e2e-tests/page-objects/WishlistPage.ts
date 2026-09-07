import type { Locator, Page } from "@playwright/test";

export class WishlistPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly wishlistButton: Locator;
  readonly productInWishlistButton: Locator;
  readonly clearWishlistButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByTestId("wishlist-add-to-cart-button");
    this.wishlistButton = page.getByTestId("header-wishlist-button");
    this.productInWishlistButton = page
      .getByTestId("wishlist-product-box-toggle-button")
      .first();
    this.clearWishlistButton = page.getByTestId("clear-wishlist-button");
  }

  async openWishlist() {
    await this.wishlistButton.click();
    // Client-side navigation: without this the next assertion sees the old page.
    await this.page.waitForURL(/\/wishlist/);
    await this.page
      .locator(
        '[data-testid="wishlist-product-box"], [data-testid="wishlist-empty-container"]',
      )
      .first()
      .waitFor({ state: "visible" });
  }

  /** Via the header link: /wishlist is ssr:false and gated on being signed in. */
  async countEntries() {
    await this.openWishlist();
    return this.page.getByTestId("wishlist-product-box").count();
  }

  /** The tile raises no notification, so the cart request is the signal. */
  async addFirstProductToCart() {
    const cartUpdated = this.page.waitForResponse(
      (response) => response.url().includes("/checkout/cart") && response.ok(),
      { timeout: 30000 },
    );
    await this.addToCartButton.first().click();
    await cartUpdated;
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
