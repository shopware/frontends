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
  readonly countryState: Locator;
  readonly submitButton: Locator;
  readonly termsBox: Locator;
  readonly termCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToCheckoutButton = page.getByTestId("cart-checkout-link");
    this.placeOrderButton = page.getByTestId("checkout-place-order-button");
    this.loginOnCheckoutButton = page.getByTestId("checkout-sign-in-link");
    this.notCreateAccountCheck = page.getByTestId(
      "checkout-create-account-checkbox",
    );
    this.salutation = page.getByTestId("checkout-pi-salutation-select");
    this.firstName = page.getByTestId("checkout-pi-first-name-input");
    this.lastName = page.getByTestId("checkout-pi-last-name-input");
    this.emailAdrdress = page.getByTestId("checkout-pi-email-input");
    this.street = page.getByTestId("checkout-pi-street-address-input");
    this.zipcode = page.getByTestId("checkout-pi-zip-code-input");
    this.city = page.getByTestId("checkout-pi-city-input");
    this.country = page.getByTestId("country-select");
    this.countryState = page.getByTestId("checkout-pi-state-input");
    this.submitButton = page.getByTestId("checkout-pi-submit-button");
    this.termsBox = page.getByTestId("checkout-terms-box");
    this.termCheckbox = page.getByTestId("checkout-t&c-checkbox-tos");
  }

  async goToCheckout() {
    await this.page.waitForSelector("[data-testid='sidebar-right']");
    await this.page.getByTestId("sidebar-right").isVisible();
    await this.goToCheckoutButton.click();
    await this.page.waitForURL("**/checkout");
  }

  async markTerms() {
    await this.page.waitForLoadState();
    await this.termsBox.isVisible();
    await this.termCheckbox.isVisible();
    await this.termCheckbox.dispatchEvent("click");
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
    city: string,
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
    await this.countryState.selectOption({ label: "Bavaria" });
    await this.submitButton.click();
  }
}
