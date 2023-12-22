import { expect, Locator, Page } from "@playwright/test";
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
