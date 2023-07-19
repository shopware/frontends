import { expect, Locator, Page } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly variant: Locator;
  readonly variantText: Locator;
  readonly productOption: Locator;
  readonly miniCartLink: Locator;
  readonly productRemove: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.getByTestId("add-to-cart-button");
    this.variant = page.getByTestId("product-variant");
    this.variantText = page.getByTestId("product-variant-text");
    this.productOption = page.getByTestId("cart-product-options");
    this.miniCartLink = page.getByTestId("cart-button");
    this.productRemove = page.getByTestId("product-remove-button");
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
    for (const variant of await this.page
      .getByTestId("product-variant-text")
      .all())
      await variant.click();
    await this.page.waitForLoadState("load");
    await this.addToCartButton.waitFor();
    await this.addToCartButton.click();
    await this.miniCartLink.click();
    expect(this.variantText.textContent).toEqual(
      this.productOption.textContent,
    );
    await this.page.waitForLoadState("networkidle");
    await this.productRemove.click();
    await this.page.getByTestId("cart-close-button").click();
  }
}
