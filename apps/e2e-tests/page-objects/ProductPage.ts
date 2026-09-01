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

    // Not every option combination resolves to a real variant, and one that
    // does not leaves the page untouched, so try the unselected ones in turn.
    // The handler sits on the label; clicking the inner text does nothing.
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

    // Each variant has its own URL, so the navigation is the proof the switch
    // happened. Without it this passes even when the click does nothing and
    // the original variant is what reaches the cart.
    if (!switched) {
      throw new Error("No variant option switched the product.");
    }
    await expect(this.page.getByTestId("loading")).toHaveCount(0);

    // Only returns once the storefront confirms the line item.
    await this.addToCart();

    await this.miniCartLink.click();
    await this.page.getByTestId("sidebar-right").waitFor({ state: "visible" });

    // The cart renders no variant options, so the variant identity is asserted
    // on the detail page above rather than here.
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
