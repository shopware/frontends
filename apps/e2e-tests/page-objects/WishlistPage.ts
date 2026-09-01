import type { Locator, Page } from "@playwright/test";

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
    // Client-side navigation: without this the next assertion sees the old page.
    await this.page.waitForURL(/\/wishlist/);
    await this.page
      .locator('[data-testid="product-box"], [data-testid="wishlist-empty"]')
      .first()
      .waitFor({ state: "visible" });
  }

  /**
   * Via the header link, not a goto: /wishlist is ssr:false and gated on the
   * signed-in state, so a hard navigation renders neither list nor empty state.
   */
  async countEntries() {
    await this.openWishlist();
    return this.page.getByTestId("product-box").count();
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
