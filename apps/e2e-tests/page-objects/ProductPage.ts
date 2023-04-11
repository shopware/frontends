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
    this.addToCartButton = page.locator("[data-testid='add-to-cart-button']");
    this.variant = page.locator("[data-testid='product-variant']");
    this.variantText = page.locator("[data-testid='product-variant-text']");
    this.productOption = page.locator("[data-testid='cart-product-options']");
    this.miniCartLink = page.locator("[data-testid='cart-button']");
    this.productRemove = page.locator("[data-testid='product-remove-button']");
  }

  async addToCart() {
    await this.page.waitForLoadState("networkidle"),
      await this.addToCartButton.click();
  }

  async addVariantToCart() {
    for (const variant of await this.page
      .locator("[data-testid='product-variant-text']")
      .all())
      await variant.click(), await this.page.waitForLoadState("load");
    await this.addToCartButton.isEnabled();
    await this.addToCartButton.click(),
      await this.miniCartLink.click(),
      expect(this.variantText.textContent).toEqual(
        this.productOption.textContent
      ),
      await this.page.waitForLoadState("networkidle");
    await this.productRemove.click(),
      await this.page.locator("[data-testid='cart-close-button']").click();
  }
}
