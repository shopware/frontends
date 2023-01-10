import { expect, Locator, Page } from "@playwright/test";
import { AbstractPage } from "./AbstractPage";

export class HomePage extends AbstractPage {
  //readonly page: Page
  readonly signInButton: Locator;
  readonly linkToCartPage: Locator;
  readonly linkToRegistrationPage: Locator;
  readonly searchBar: Locator;
  readonly addToWishlist: Locator;
  readonly wishlistButton: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = page.locator("[data-testid='header-sign-in-link']");
    this.linkToCartPage = page.locator("text='Smoking Board Cedar Wood'");
    this.searchBar = page.locator("[data-testid='layout-search-input']");
    this.linkToRegistrationPage = page.locator(
      "[data-testid='login-sign-up-link']"
    );
    this.addToWishlist = page.locator(
      "[data-testid='product-box-wishlist-icon-not-in']"
    );
  }

  async visitMainPage() {
    await this.page.goto("/");
  }

  async clickOnSignIn() {
    await Promise.all([
      this.page.waitForLoadState("load"),
      this.signInButton.click(),
    ]);
  }

  async openCartPage() {
    await Promise.all([
      this.linkToCartPage.click(),
      this.page.waitForSelector("[data-testid='product-quantity']"),
      this.page.waitForLoadState("load"),
    ]);
  }

  async openRegistrationPage() {
    await this.linkToRegistrationPage.click();
  }

  async typeSearchPhrase(phrase: string) {
    await this.searchBar.click();
    await this.searchBar.type(phrase);
    await this.page.keyboard.press("Enter");
  }

  async addProductToWishlist() {
    await Promise.all([
      this.page.waitForLoadState("load"),
      await this.addToWishlist.nth(13).click(),
    ]);
  }
}
