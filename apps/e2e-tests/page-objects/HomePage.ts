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
    this.accountMenuHelloButton = page.getByTestId("account-menu-hello-button");
    this.myAccountLink = page.getByTestId("header-my-account-link");
  }

  async visitMainPage() {
    await this.page.goto("/");
  }

  async clickOnSignIn() {
    await expect(this.page.getByTestId("header-sign-in-link")).toBeVisible();
    await this.signInButton.waitFor();
    await this.signInButton.click({ delay: 500 });
  }

  async openCartPage() {
    await this.linkToCartPage.waitFor();
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
    await this.linkToRegistrationPage.click({ delay: 500 });
  }

  async typeSearchPhrase(phrase: string) {
    await this.searchBar.click();
    await this.searchBar.type(phrase);
    await this.page.keyboard.press("Enter");
  }

  async addProductToWishlist() {
    await Promise.all([
      this.page.waitForLoadState("load"),
      await this.addToWishlist.nth(13).dispatchEvent("click"),
    ]);
  }

  async openMyAccount() {
    await this.accountMenuHelloButton.waitFor();
    await this.accountMenuHelloButton.dispatchEvent("click");
    await this.myAccountLink.waitFor();
    await this.myAccountLink.dispatchEvent("click");
  }
}
