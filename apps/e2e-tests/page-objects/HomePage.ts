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
   * The URL is checked before the product card because the home page carries
   * cards of its own, so the card alone would pass without ever leaving home.
   */
  async openFirstCategoryPage() {
    const sameTabEntries = this.page.locator(
      '[role="menubar"] [role="menuitem"]:not([target="_blank"])',
    );
    await sameTabEntries.first().waitFor({ state: "visible" });

    const tried: string[] = [];
    for (const entry of await sameTabEntries.all()) {
      const href = await entry.getAttribute("href");
      if (!href) continue;
      tried.push((await entry.textContent())?.trim() || "(unnamed)");
      await entry.click();
      try {
        await this.page.waitForURL((url) => url.pathname.startsWith(href), {
          timeout: 4000,
        });
        await this.page
          .getByTestId("product-box-product-name-link")
          .first()
          .waitFor({ state: "visible", timeout: 4000 });
        return;
      } catch {
        await this.visitMainPage();
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
