import { expect, Locator, Page } from "@playwright/test";

export class CheckoutPage {
  readonly page: Page;
  readonly goToCheckoutButton: Locator;
  readonly placeOrderButton: Locator;
  readonly loginOnCheckoutButton: Locator;
  readonly notCreateAccountCheck: Locator;
  readonly salutation: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly emailAdrdress: Locator;
  readonly street: Locator;
  readonly zipcode: Locator;
  readonly city: Locator;
  readonly country: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToCheckoutButton = page.locator(
      "[data-testid='cart-checkout-link']"
    );
    this.placeOrderButton = page.locator(
      "[data-testid='checkout-place-order-button']"
    );
    this.loginOnCheckoutButton = page.locator(
      "[data-testid='checkout-sign-in-link']"
    );
    this.notCreateAccountCheck = page.locator(
      "[data-testid='checkout-create-account-checkbox']"
    );
    this.salutation = page.locator(
      "[data-testid='checkout-pi-salutation-select']"
    );
    this.firstName = page.locator(
      "[data-testid='checkout-pi-first-name-input']"
    );
    this.lastName = page.locator("[data-testid='checkout-pi-last-name-input']");
    this.emailAdrdress = page.locator(
      "[data-testid='checkout-pi-email-input']"
    );
    this.street = page.locator(
      "[data-testid='checkout-pi-street-address-input']"
    );
    this.zipcode = page.locator("[data-testid='checkout-pi-zip-code-input']");
    this.city = page.locator("[data-testid='checkout-pi-city-input']");
    this.country = page.locator("[data-testid='checkout-pi-country-input']");
    this.submitButton = page.locator(
      "[data-testid='checkout-pi-submit-button']"
    );
  }

  async goToCheckout() {
    await this.page.waitForSelector("[data-testid='cart-product-image']");
    await this.goToCheckoutButton.click();
  }

  async placeOrder() {
    await this.page.waitForLoadState();
    await this.placeOrderButton.click();
  }

  async loginOnCheckout() {
    await this.page.waitForLoadState();
    await this.loginOnCheckoutButton.click();
  }

  async checkNotCreateAccount() {
    await this.notCreateAccountCheck.check();
  }

  async fillGuestUserData(
    firstName: string,
    lastName: string,
    email: string,
    street: string,
    zipcode: string,
    city: string
  ) {
    await this.page.waitForLoadState();
    await this.salutation.selectOption({ label: "Mr." });
    await this.firstName.type(firstName);
    await this.lastName.type(lastName);
    await this.emailAdrdress.type(email);
    await this.street.type(street);
    await this.zipcode.type(zipcode);
    await this.city.type(city);
    await this.country.selectOption({ label: "Germany" });
    await this.submitButton.click();
  }
}
