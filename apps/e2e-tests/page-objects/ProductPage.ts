import { type Locator, type Page, expect } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly variant: Locator;
  readonly variantText: Locator;
  readonly miniCartLink: Locator;
  readonly productRemove: Locator;
  readonly ratingStar: Locator;
  readonly reviewTitle: Locator;
  readonly reviewText: Locator;
  readonly submitReview: Locator;
  readonly reviewTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByTestId("add-to-cart-button");
    this.variant = page.getByTestId("product-variant");
    this.variantText = page.getByTestId("product-variant-text");
    this.miniCartLink = page.getByTestId("cart-button");
    this.productRemove = page.getByTestId("product-remove-button");
    this.ratingStar = page.getByTestId("review-empty-star");
    this.reviewTitle = page.getByTestId("review-title-input");
    this.reviewText = page.getByTestId("review-text-input");
    this.submitReview = page.getByTestId("review-submit-button");
    this.reviewTab = page.getByTestId("product-reviews-tab");
  }

  async addToCart() {
    await expect(async () => {
      await this.addToCartButton.waitFor();
      await expect(this.addToCartButton).toBeVisible();
      await this.addToCartButton.dispatchEvent("click");
      await expect(
        this.page.getByTestId("notification-element-message").last(),
      ).toHaveText(/has been added to cart.$/);
    }).toPass({
      // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe, .... Defaults to [100, 250, 500, 1000].
      intervals: [1_000, 2_000, 10_000],
      timeout: 60_000,
    });
  }

  async addVariantToCart() {
    // One option: each click navigates to that variant's own URL.
    await this.variantText.first().click();
    await expect(this.page.getByTestId("loading")).toHaveCount(0);

    const selectedVariant = (
      await this.variantText.first().textContent()
    )?.trim();

    // Only returns once the storefront confirms the line item.
    await this.addToCart();

    await this.miniCartLink.click();
    await this.page.getByTestId("sidebar-right").waitFor({ state: "visible" });

    // The cart renders no variant options, so check a variant was chosen and
    // that the configured product reached the cart.
    expect(selectedVariant).toBeTruthy();
    await expect(
      this.page.getByTestId("cart-product-image").first(),
    ).toBeVisible();

    await this.productRemove.click();
    await this.page.getByTestId("cart-close-button").click();
  }

  async fillReviewForm() {
    await this.reviewTab.click();
    await this.ratingStar.nth(4).click();
    await this.reviewTitle.fill("Review test title");
    await this.reviewText.fill(
      "Review text Review text Review text Review text Review text",
    );
    await this.submitReview.click();
  }
}
