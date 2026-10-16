import type { Locator, Page } from "@playwright/test";

import {
  selectDefaultCountry,
  selectFirstOptionIfPresent,
} from "../utils/form";
import { type StoreApi, captureStoreApi } from "../utils/store-api";

export class CheckoutPage {
  readonly page: Page;
  readonly storeApi: { value?: StoreApi };
  readonly goToCheckoutButton: Locator;
  readonly placeOrderButton: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly emailAdrdress: Locator;
  readonly street: Locator;
  readonly zipcode: Locator;
  readonly city: Locator;
  readonly country: Locator;
  readonly countryState: Locator;
  readonly createAccountToggle: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.goToCheckoutButton = page.getByTestId("checkout-cart-link");
    this.placeOrderButton = page.getByTestId("checkout-place-order-button");
    this.firstName = page.getByTestId("checkout-pi-first-name-input");
    this.lastName = page.getByTestId("checkout-pi-last-name-input");
    this.emailAdrdress = page.getByTestId("checkout-pi-email-input");
    this.street = page.getByTestId("checkout-pi-street-address-input");
    this.zipcode = page.getByTestId("checkout-pi-zip-code-input");
    this.city = page.getByTestId("checkout-pi-city-input");
    this.country = page.getByTestId("country-select");
    this.countryState = page.getByTestId("checkout-pi-state-input");
    this.createAccountToggle = page.getByTestId(
      "checkout-create-account-toggle",
    );
    this.passwordInput = page.getByTestId("checkout-pi-password-input");
    this.storeApi = captureStoreApi(page);
  }

  async goToCheckout() {
    await this.page.waitForSelector("[data-testid='mini-cart-container']");
    await this.page
      .getByTestId("mini-cart-container")
      .waitFor({ state: "visible" });
    await this.goToCheckoutButton.click();
    await this.page.waitForURL("**/checkout");
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    // `commit`, not the default `load`: an ssr:false page may never fire it.
    // The order total below is the real readiness signal.
    await this.page.waitForURL(/\/checkout\/(success|finish)/, {
      timeout: 60000,
      waitUntil: "commit",
    });
    await this.page
      .getByTestId("order-total")
      .waitFor({ state: "visible", timeout: 45000 });
  }

  /** Passing a password switches checkout from a guest order to an account. */
  async fillGuestUserData(
    firstName: string,
    lastName: string,
    email: string,
    street: string,
    zipcode: string,
    city: string,
    password?: string,
  ) {
    if (password) {
      await this.createAccountToggle.click();
      await this.passwordInput.fill(password);
    }
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.emailAdrdress.fill(email);
    await this.street.fill(street);
    await this.zipcode.fill(zipcode);
    await this.city.fill(city);
    await selectDefaultCountry(this.page, this.country, this.storeApi);
    await selectFirstOptionIfPresent(this.countryState);
  }
}
