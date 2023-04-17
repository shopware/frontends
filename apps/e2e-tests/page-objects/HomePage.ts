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

  constructor(page: Page) {
    super(page);
    this.signInButton = page.getByTestId("header-sign-in-link");
    this.linkToCartPage = page.locator("text='Smoking Board Cedar Wood'");
    this.linkToVariantPage = page.locator(
      "text='Pepper white, ground, Muntok pearl'"
    );
    this.searchBar = page.getByTestId("layout-search-input");
    this.linkToRegistrationPage = page.getByTestId("login-sign-up-link");
    this.addToWishlist = page.getByTestId("product-box-wishlist-icon-not-in");
  }

  async visitMainPage() {
    await this.page.goto("/");
  }

  async clickOnSignIn() {
    await this.page.waitForLoadState("load");
    await this.signInButton.isEnabled();
    await this.signInButton.click();
  }

  async openCartPage() {
    await this.page.waitForLoadState("load");
    await this.linkToCartPage.click();
    await this.page.waitForSelector("[data-testid='product-quantity']");
    await this.page.waitForLoadState("load");
  }

  async openVariantsCartPage() {
    await this.page.waitForLoadState("load");
    await this.linkToVariantPage.click();
    await this.page.waitForSelector("[data-testid='product-quantity']");
  }

  async openRegistrationPage() {
    await this.page.waitForLoadState("load");
    await this.linkToRegistrationPage.isVisible();
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
