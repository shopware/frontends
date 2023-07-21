import { expect, Locator, Page } from "@playwright/test";

export class MyAccountPage {
  readonly page: Page;
  readonly personalFirstName: Locator;
  readonly personalLastName: Locator;
  readonly personalEmail: Locator;
  readonly accountPersonalDataSubmitButton: Locator;
  readonly changePaymentMethodButton: Locator;
  readonly accountPaymentSubmitButton: Locator;
  readonly accountChangeProfileButton: Locator;
  readonly accountChangeBillingAddressButton: Locator;
  readonly accountChangeShippingAddressButton: Locator;
  readonly newsletterCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountChangeProfileButton = page.getByTestId(
      "my-account-change-profile-button",
    );
    this.personalFirstName = page.getByTestId(
      "account-personal-data-firstname-input",
    );
    this.personalLastName = page.getByTestId(
      "account-personal-data-lastname-input",
    );
    this.personalEmail = page.getByTestId("account-personal-data-email-input");
    this.accountPersonalDataSubmitButton = page.getByTestId(
      "account-personal-data-submit-button",
    );
    this.changePaymentMethodButton = page.getByTestId(
      "my-account-change-payment-method-button",
    );
    this.accountPaymentSubmitButton = page.getByTestId(
      "account-payment-submit-button",
    );
    this.accountChangeBillingAddressButton = page.getByTestId(
      "my-account-change-default-billing-address-button",
    );
    this.accountChangeShippingAddressButton = page.getByTestId(
      "my-account-change-default-shipping-address-button",
    );
    this.newsletterCheckbox = page.getByTestId("#newsletter-checkbox");
  }

  async changePersonalData() {
    await this.accountChangeProfileButton.waitFor();
    await this.accountChangeProfileButton.dispatchEvent("click");
  }

  async changePersonalFirstName(firstname: string) {
    await this.page.waitForURL("**/account/profile");
    await this.personalFirstName.clear({ force: true });
    await this.personalFirstName.fill(firstname);
    await this.accountPersonalDataSubmitButton.click();
  }

  async changePersonalLastName(lastname: string) {
    await this.personalLastName.clear({ force: true });
    await this.personalLastName.fill(lastname);
    await this.accountPersonalDataSubmitButton.click();
  }

  async changePersonalEmail(email: string) {
    await this.personalEmail.clear();
    await this.personalEmail.type(email);
  }

  async changeDefaultBillingAddress() {
    await this.accountChangeBillingAddressButton.click();
  }

  async changeDefaultShippingAddress() {
    await this.accountChangeShippingAddressButton.click();
  }

  async subsribeNewsletter() {
    await this.newsletterCheckbox.click();
  }
}
