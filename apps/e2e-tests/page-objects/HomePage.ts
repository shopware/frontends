import type { Locator, Page } from "@playwright/test";

import { AbstractPage } from "./AbstractPage";

export class HomePage extends AbstractPage {
  //readonly page: Page
  readonly signInButton: Locator;
  readonly linkToCartPage: Locator;
  readonly linkToVariantPage: Locator;
  readonly linkToRegistrationPage: Locator;
  readonly searchBar: Locator;
  readonly addToWishlist: Locator;
  readonly wishlistButton: Locator;
  readonly accountMenuHelloButton: Locator;
  readonly myAccountLink: Locator;
  readonly suggestResultLink: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = page.getByTestId("header-sign-in-link");
    this.linkToCartPage = page.locator("text='YORK 3'");
    this.linkToVariantPage = page.locator(
      "text='Pepper white, ground, Muntok pearl'",
    );
    this.searchBar = page.getByTestId("layout-search-input");
    this.linkToRegistrationPage = page.getByTestId("login-sign-up-link");
    this.addToWishlist = page
      .getByTestId("product-box-wishlist-icon-not-in")
      .last();
    this.accountMenuHelloButton = page.getByTestId("account-menu-hello-button");
    this.myAccountLink = page.getByTestId("header-my-account-link");
    this.suggestResultLink = page.getByTestId(
      "layout-search-result-box-more-link",
    );
  }

  async visitMainPage() {
    await this.page.goto("/");
  }

  async clickOnSignIn() {
    await this.signInButton.waitFor();
    await this.signInButton.click({ delay: 500 });
  }

  async openCartPage() {
    await this.page.waitForTimeout(500);
    await this.linkToCartPage.waitFor();
    await this.linkToCartPage.click();
    await this.page.waitForSelector("[data-testid='product-quantity']", {
      state: "visible",
    });
  }

  async openVariantsCartPage() {
    await this.page.waitForLoadState("networkidle");
    await this.linkToVariantPage.click();
    await this.page.waitForSelector("[data-testid='product-quantity']");
  }

  async openCategoryPage() {
    await this.page.waitForLoadState("networkidle");
    await this.page
      .getByRole("menuitem", { name: "Products", exact: true })
      .click();
  }

  /**
   * Template agnostic navigation, used by the @accessibility run.
   * openCategoryPage and openCartPage above select on vue-demo-store content
   * ("Products", "YORK 3") that does not exist in vue-starter-template.
   *
   * Nav entries are sales channel content, so the first one is not guaranteed
   * to list products. New-tab entries are skipped and the rest tried in order.
   *
   * Entries are opened by their href rather than clicked. A click hands over to
   * the client router, which swaps the URL long before the listing renders, and
   * axe would scan the page mid-transition.
   */
  async openFirstCategoryPage() {
    const sameTabEntries = this.page.locator(
      '[role="menubar"] [role="menuitem"]:not([target="_blank"])',
    );
    await sameTabEntries.first().waitFor({ state: "visible" });

    // Bounded, so a storefront where nothing lists products reports the error
    // below instead of running past the 30s test timeout.
    const candidates = (await sameTabEntries.all()).slice(0, 3);

    const tried: string[] = [];
    for (const entry of candidates) {
      const label = (await entry.textContent())?.trim() || "(unnamed)";
      const href = await entry.getAttribute("href");
      if (!href) {
        tried.push(`${label} (no href)`);
        continue;
      }
      tried.push(label);
      await this.page.goto(href);
      try {
        await this.page
          .getByTestId("product-box-product-name-link")
          .first()
          .waitFor({ state: "visible", timeout: 3000 });
        return;
      } catch {
        continue;
      }
    }

    throw new Error(
      `No top navigation entry opened a product listing. Tried: ${tried.join(", ")}.`,
    );
  }

  async openFirstProductPage() {
    await this.page
      .getByTestId("product-box-product-name-link")
      .first()
      .click();
    await this.page.waitForSelector("[data-testid='product-quantity']", {
      state: "visible",
    });
  }

  async openRegistrationPage() {
    await this.linkToRegistrationPage.click();
    await this.page.waitForURL("**/register");
  }

  async typeSearchPhrase(phrase: string) {
    await this.page.waitForLoadState("networkidle");
    await this.searchBar.click();
    await this.searchBar.type(phrase);
    await this.page.waitForLoadState();
    await this.page.waitForSelector("[data-testid='layout-search-result-box']");
    await this.page.keyboard.press("Enter");
  }

  async searchBySuggest(phrase: string) {
    await this.page.waitForLoadState("networkidle");
    await this.searchBar.click();
    await this.searchBar.type(phrase);
    await this.page.waitForLoadState();
    await this.page.waitForSelector("[data-testid='layout-search-result-box']");
    await this.suggestResultLink.click();
  }

  async addProductToWishlist() {
    await this.page.waitForLoadState("networkidle");
    await this.addToWishlist.dispatchEvent("click");
  }

  async openMyAccount() {
    await this.accountMenuHelloButton.waitFor();
    await this.accountMenuHelloButton.dispatchEvent("click");
    await this.myAccountLink.waitFor();
    await this.myAccountLink.dispatchEvent("click");
    await this.page.waitForURL("**/account");
  }
}
