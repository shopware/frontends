import { expect, Locator, Page } from "@playwright/test";
import { AbstractPage } from "./AbstractPage";

export class HomePage extends AbstractPage {
  //readonly page: Page
  readonly signInButton: Locator;
  readonly linkToCartPage: Locator;
  readonly linkToRegistrationPage: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = page.locator("[data-testid='header-sign-in-link']");
    this.linkToCartPage = page.locator("text='Smoking Board Cedar Wood'");
    this.linkToRegistrationPage = page.locator("text=' Sign up '");
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
    ]);
  }

  async openRegistrationPage() {
    await this.linkToRegistrationPage.click();
  }
}
