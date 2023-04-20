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
    this.accountChangeProfileButton = page.locator(
      "[data-testid='my-account-change-profile-button']"
    );
    this.personalFirstName = page.locator(
      "[data-testid='account-personal-data-firstname-input']"
    );
    this.personalLastName = page.locator(
      "[data-testid='account-personal-data-lastname-input']"
    );
    this.personalEmail = page.locator(
      "data-testid='account-personal-data-email-input']"
    );
    this.accountPersonalDataSubmitButton = page.locator(
      "[data-testid='account-personal-data-submit-button']"
    );
    this.changePaymentMethodButton = page.locator(
      "[data-testid='my-account-change-payment-method-button']"
    );
    this.accountPaymentSubmitButton = page.locator(
      "[data-testid='account-payment-submit-button']"
    );
    this.accountChangeBillingAddressButton = page.locator(
      "[data-testid='my-account-change-default-billing-address-button']"
    );
    this.accountChangeShippingAddressButton = page.locator(
      "[data-testid='my-account-change-default-shipping-address-button']"
    );
    this.newsletterCheckbox = page.locator("#newsletter-checkbox");
  }

  async changePersonalData() {
    await this.page.waitForLoadState();
    await this.accountChangeProfileButton.click();
    await this.page.waitForLoadState("load")
  }

  async changePersonalFirstName(firstname: string) {
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
    await this.page.waitForLoadState();
    await this.personalEmail.clear();
    await this.personalEmail.type(email);
  }

  async changeDefaultBillingAddress() {
    await this.page.waitForLoadState();
    await this.accountChangeBillingAddressButton.click();
  }

  async changeDefaultShippingAddress() {
    await this.page.waitForLoadState();
    await this.accountChangeShippingAddressButton.click();
  }

  async subsribeNewsletter() {
    await this.newsletterCheckbox.click();
    await this.page.waitForLoadState();
  }
}
