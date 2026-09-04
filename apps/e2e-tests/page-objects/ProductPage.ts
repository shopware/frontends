import { type Locator, type Page, expect } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly variant: Locator;
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
    const urlBefore = this.page.url();
    const isSelected = await this.variant.evaluateAll((options) =>
      options.map((option) =>
        option.className.includes("border-brand-primary"),
      ),
    );

    // Not every option combination is a real variant, and one that is not
    // leaves the page untouched. The handler is on the label, not the text.
    let switched = false;
    for (const [index, selected] of isSelected.entries()) {
      if (selected) continue;
      await this.variant.nth(index).click();
      try {
        await this.page.waitForURL((url) => url.href !== urlBefore, {
          timeout: 10000,
        });
        switched = true;
        break;
      } catch {
        continue;
      }
    }
    if (!switched) {
      throw new Error("No variant option switched the product.");
    }

    await expect(this.page.getByTestId("loading")).toHaveCount(0);

    // The id the add-to-cart button will actually submit.
    const variantId =
      await this.addToCartButton.getAttribute("data-product-id");
    if (!variantId) {
      throw new Error("The add-to-cart button carries no data-product-id.");
    }

    await this.addToCart();
    await this.miniCartLink.click();
    await this.page.getByTestId("sidebar-right").waitFor({ state: "visible" });

    // Identity, not just presence: navigating to a variant URL while adding the
    // original product would otherwise pass.
    await expect(
      this.page.locator(
        `[data-testid="cart-line-item"][data-product-id="${variantId}"]`,
      ),
    ).toHaveCount(1);

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
