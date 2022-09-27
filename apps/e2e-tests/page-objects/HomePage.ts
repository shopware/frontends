import { expect, Locator, Page } from "@playwright/test";
import { AbstractPage } from "./AbstractPage";

export class HomePage extends AbstractPage {
  //readonly page: Page
  readonly signInButton: Locator;
  readonly linkToCartPage: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = page.locator("[data-testid='header-sign-in-link']");
    this.linkToCartPage = page.locator("text='Smoking Board Cedar Wood'");
  }

  async visitMainPage() {
    await this.page.goto("/");
  }

  async clickOnSignIn() {
    await this.signInButton.click();
  }

  async openCartPage() {
    await this.linkToCartPage.click();
  }
}
