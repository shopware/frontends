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
    this.usernameInput = page.getByTestId("login-email-input");
    this.passwordInput = page.getByTestId("login-password-input");
    this.submitButton = page.getByTestId("login-submit-button");
  }

  // Define login page methods
  async login(username: string, password: string) {
    await this.usernameInput.isVisible();
    await this.usernameInput.type(username);
    await this.passwordInput.type(password);
    await this.page.waitForLoadState();
    await this.submitButton.click();
  }
}
