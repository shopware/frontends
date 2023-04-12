import { expect, Locator, Page } from "@playwright/test";

export class LoginForm {
  // Define selectors
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  // Init selectors using constructor
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("[data-testid='login-email-input']");
    this.passwordInput = page.locator("[data-testid='login-password-input']");
    this.submitButton = page.locator("[data-testid='login-submit-button']");
  }

  // Define login page methods
  async login(username: string, password: string) {
    await this.usernameInput.isVisible();
    await this.usernameInput.type(username);
    await this.passwordInput.type(password);
    await this.page.waitForLoadState("networkidle");
    await this.submitButton.click();
    await this.page.waitForLoadState("load");
  }
}
