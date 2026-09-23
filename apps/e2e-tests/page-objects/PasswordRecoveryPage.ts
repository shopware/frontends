import type { Locator, Page } from "@playwright/test";

import { AbstractPage } from "./AbstractPage";

export class PasswordRecoveryPage extends AbstractPage {
  readonly forgotPasswordLink: Locator;
  readonly recoverForm: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly resetForm: Locator;
  readonly expiredMessage: Locator;
  readonly retryButton: Locator;

  constructor(page: Page) {
    super(page);
    this.forgotPasswordLink = page.getByTestId("login-forgot-password-link");
    this.recoverForm = page.getByTestId("recover-password-form");
    this.emailInput = page.getByTestId("recover-password-email-input");
    this.submitButton = page.getByTestId("recover-password-submit-button");
    this.successMessage = page.getByTestId("recover-password-success-message");
    this.resetForm = page.getByTestId("reset-password-form");
    this.expiredMessage = page.getByTestId("reset-password-expired-message");
    this.retryButton = page.getByTestId("reset-password-retry-button");
  }

  async visitRecoverPage() {
    await this.page.goto("/account/recover");
  }

  async visitResetPage(hash: string) {
    await this.page.goto(`/account/recover/password?hash=${hash}`);
  }

  async requestRecoveryMail(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
