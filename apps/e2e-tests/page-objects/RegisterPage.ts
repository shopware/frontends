import { faker } from "@faker-js/faker";
import { type Locator, type Page, expect } from "@playwright/test";

import { uniqueEmail } from "../utils/data-helpers";
import {
  checkIfPresent,
  fillIfPresent,
  selectDefaultCountry,
  selectFirstOptionIfPresent,
} from "../utils/form";
import type { StoreApi } from "../utils/store-api";

export class RegisterForm {
  // Define selectors
  readonly page: Page;
  readonly storeApi: { value?: StoreApi };
  readonly accountType: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly emailAdrdress: Locator;
  readonly emailConfirmation: Locator;
  readonly password: Locator;
  readonly passwordConfirmation: Locator;
  readonly birthdayDay: Locator;
  readonly birthdayMonth: Locator;
  readonly birthdayYear: Locator;
  readonly dataProtection: Locator;
  readonly vatId: Locator;
  readonly companyName: Locator;
  readonly street: Locator;
  readonly zipcode: Locator;
  readonly city: Locator;
  readonly country: Locator;
  readonly countryState: Locator;
  readonly submitButton: Locator;

  // Init selectors using constructor
  constructor(page: Page, storeApi: { value?: StoreApi }) {
    this.page = page;
    this.accountType = page.getByTestId("registration-account-type-select");
    this.firstName = page.getByTestId("registration-first-name-input");
    this.lastName = page.getByTestId("registration-last-name-input");
    this.emailAdrdress = page.getByTestId("registration-email-input");
    this.emailConfirmation = page.getByTestId(
      "registration-email-confirmation-input",
    );
    this.password = page.getByTestId("registration-password-input");
    this.passwordConfirmation = page.getByTestId(
      "registration-password-confirmation-input",
    );
    this.birthdayDay = page.getByTestId("registration-birthday-day-select");
    this.birthdayMonth = page.getByTestId("registration-birthday-month-select");
    this.birthdayYear = page.getByTestId("registration-birthday-year-select");
    this.dataProtection = page.getByTestId(
      "registration-data-protection-checkbox",
    );
    this.vatId = page.getByTestId("registration-vatid-input");
    this.companyName = page.getByTestId("registration-company-input");
    this.street = page.getByTestId("registration-street-input");
    this.zipcode = page.getByTestId("registration-zipcode-input");
    this.city = page.getByTestId("registration-city-input");
    this.country = page.getByTestId("country-select");
    this.countryState = page.getByTestId("checkout-pi-state-input");
    this.submitButton = page.getByTestId("registration-submit-button");
    this.storeApi = storeApi;
  }

  // Define login page methods
  async fillCustomerData(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.emailAdrdress.fill(email);
    await this.password.fill(password);
    await this.fillShopConfiguredFields(email, password);
  }

  async fillShopConfiguredFields(email: string, password: string) {
    await fillIfPresent(this.emailConfirmation, email);
    await fillIfPresent(this.passwordConfirmation, password);
    await selectFirstOptionIfPresent(this.birthdayDay);
    await selectFirstOptionIfPresent(this.birthdayMonth);
    await selectFirstOptionIfPresent(this.birthdayYear);
    await checkIfPresent(this.dataProtection);
  }

  async fillAddressData(street: string, zipcode: string, city: string) {
    await this.street.fill(street);
    await this.zipcode.fill(zipcode);
    await this.city.fill(city);
    await selectDefaultCountry(this.page, this.country, this.storeApi);
    await selectFirstOptionIfPresent(this.countryState);
  }

  async fillCompanyData(companyName: string, vatId: string) {
    await this.accountType.selectOption({ value: "business" });
    await this.companyName.fill(companyName);
    await this.vatId.fill(vatId);
  }

  async submitRegistrationForm() {
    const form = this.page.getByTestId("registration-form");
    const failure = this.page
      .getByTestId("registration-form-error")
      .or(this.page.getByTestId("notification-element-danger"))
      .first();

    await this.submitButton.click();
    await expect
      .poll(
        async () => (await failure.isVisible()) || (await form.count()) === 0,
        { timeout: 30000 },
      )
      .toBe(true);
    if (await failure.isVisible()) {
      throw new Error(`Registration failed: ${await failure.textContent()}`);
    }
  }

  async createUser() {
    const email = uniqueEmail();
    const password = faker.internet.password();
    await this.firstName.fill(`e2e ${faker.person.firstName()}`);
    await this.lastName.fill(`e2e ${faker.person.lastName()}`);
    await this.emailAdrdress.fill(email);
    await this.password.fill(password);
    await this.fillShopConfiguredFields(email, password);
    await this.street.fill(faker.location.street());
    await this.zipcode.fill(faker.location.zipCode());
    await this.city.fill(faker.location.city());
    await selectDefaultCountry(this.page, this.country, this.storeApi);
    await selectFirstOptionIfPresent(this.countryState);
    await this.submitRegistrationForm();
  }
}
