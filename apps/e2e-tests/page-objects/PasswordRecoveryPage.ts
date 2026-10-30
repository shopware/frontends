import type { Locator, Page } from "@playwright/test";

export class PasswordRecoveryPage {
  readonly page: Page;
  readonly recoverForm: Locator;
  readonly recoverEmailInput: Locator;
  readonly recoverSubmitButton: Locator;
  readonly recoverSuccessMessage: Locator;
  readonly resetForm: Locator;
  readonly resetNewPasswordInput: Locator;
  readonly resetConfirmPasswordInput: Locator;
  readonly resetSubmitButton: Locator;
  readonly resetSuccessMessage: Locator;
  readonly resetExpiredMessage: Locator;
  readonly resetRetryButton: Locator;
  readonly errorNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.recoverForm = page.getByTestId("recover-password-form");
    this.recoverEmailInput = page.getByTestId("recover-password-email-input");
    this.recoverSubmitButton = page.getByTestId(
      "recover-password-submit-button",
    );
    this.recoverSuccessMessage = page.getByTestId(
      "recover-password-success-message",
    );
    this.resetForm = page.getByTestId("reset-password-form");
    this.resetNewPasswordInput = page.getByTestId(
      "reset-password-new-password-input",
    );
    this.resetConfirmPasswordInput = page.getByTestId(
      "reset-password-confirm-password-input",
    );
    this.resetSubmitButton = page.getByTestId("reset-password-submit-button");
    this.resetSuccessMessage = page.getByTestId(
      "reset-password-success-message",
    );
    this.resetExpiredMessage = page.getByTestId(
      "reset-password-expired-message",
    );
    this.resetRetryButton = page.getByTestId("reset-password-retry-button");
    this.errorNotification = page.getByTestId("notification-element-danger");
  }

  async visitRecoverPage() {
    await this.page.goto("/account/recover");
  }

  async visitResetPage(hash: string) {
    await this.page.goto(`/account/recover/password?hash=${hash}`);
  }

  async requestRecoveryMail(email: string) {
    await this.recoverEmailInput.fill(email);
    await this.recoverSubmitButton.click();
  }

  async resetPassword(password: string) {
    await this.resetNewPasswordInput.fill(password);
    await this.resetConfirmPasswordInput.fill(password);
    await this.resetSubmitButton.click();
  }
}
