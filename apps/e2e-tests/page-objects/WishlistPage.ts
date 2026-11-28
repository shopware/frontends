import { type Locator, type Page, expect } from "@playwright/test";

export class WishlistPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly wishlistButton: Locator;
  readonly productInWishlistButton: Locator;
  readonly clearWishlistButton: Locator;
  readonly productBoxes: Locator;
  readonly emptyContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByTestId("wishlist-add-to-cart-button");
    this.wishlistButton = page.getByTestId("header-wishlist-button");
    this.productInWishlistButton = page
      .getByTestId("wishlist-product-box-toggle-button")
      .first();
    this.clearWishlistButton = page.getByTestId("clear-wishlist-button");
    this.productBoxes = page.getByTestId("wishlist-product-box");
    this.emptyContainer = page.getByTestId("wishlist-empty-container");
  }

  async openWishlist() {
    await this.wishlistButton.click();
    // Client-side navigation: without this the next assertion sees the old page.
    await this.page.waitForURL(/\/wishlist/);
    await this.page
      .locator(
        '[data-testid="wishlist-product-box"], [data-testid="wishlist-empty-container"]',
      )
      .filter({ visible: true })
      .first()
      .waitFor({ state: "visible" });
  }

  async addFirstProductToCart() {
    await this.addToCartButton.first().click();
    await expect(
      this.page.getByTestId("notification-element-success").last(),
    ).toBeVisible({ timeout: 30000 });
  }

  async removeProductFromWishlist() {
    const before = await this.productBoxes.count();
    await this.productInWishlistButton.click();
    await expect(this.productBoxes).toHaveCount(before - 1, {
      timeout: 30000,
    });
  }

  async clearWishlist() {
    await this.clearWishlistButton.click();
    await expect(this.emptyContainer).toBeVisible({ timeout: 30000 });
  }
}
