import type { Locator, Page } from "@playwright/test";

import { selectCountry, selectFirstOptionIfPresent } from "../utils/form";

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
    await this.page.getByTestId("sidebar-right").waitFor({ state: "visible" });
    await this.goToCheckoutButton.click();
    await this.page.waitForURL("**/checkout");
  }

  /** Not every template asks for terms acceptance. */
  async markTerms() {
    if ((await this.termCheckbox.count()) === 0) return;
    await this.termCheckbox.waitFor({ state: "visible" });
    await this.termCheckbox.check();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    // Round-trips to the backend before redirecting to the confirmation page.
    await this.page.waitForURL(/\/checkout\/(success|finish)/, {
      timeout: 60000,
    });
  }

  async loginOnCheckout() {
    await this.page.waitForLoadState();
    await this.loginOnCheckoutButton.click();
  }

  /** The starter checks out as a guest by default, so there is nothing to untick. */
  async checkNotCreateAccount() {
    if ((await this.notCreateAccountCheck.count()) === 0) return;
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
    await selectFirstOptionIfPresent(this.salutation);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.emailAdrdress.fill(email);
    await this.street.fill(street);
    await this.zipcode.fill(zipcode);
    await this.city.fill(city);
    await selectCountry(this.page, this.country, "Germany");
    await selectFirstOptionIfPresent(this.countryState);

    // Saving the address registers the guest; without that session
    // /checkout/order answers 403 CUSTOMER_NOT_LOGGED_IN.
    const guestRegistered = this.page.waitForResponse(
      (response) =>
        response.url().includes("/account/register") && response.ok(),
      { timeout: 30000 },
    );
    await this.submitButton.click();
    await guestRegistered;
  }
}
