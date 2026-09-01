import { faker } from "@faker-js/faker";
import type { Locator, Page } from "@playwright/test";

import { uniqueEmail } from "../utils/data-helpers";
import { selectCountry, selectFirstOptionIfPresent } from "../utils/form";

export class RegisterForm {
  // Define selectors
  readonly page: Page;
  readonly accountType: Locator;
  readonly salutation: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly emailAdrdress: Locator;
  readonly password: Locator;
  readonly vatId: Locator;
  readonly companyName: Locator;
  readonly street: Locator;
  readonly zipcode: Locator;
  readonly city: Locator;
  readonly country: Locator;
  readonly countryState: Locator;
  readonly submitButton: Locator;

  // Init selectors using constructor
  constructor(page: Page) {
    this.page = page;
    this.accountType = page.getByTestId("registration-account-type-select");
    this.salutation = page.getByTestId("registration-salutation-select");
    this.firstName = page.getByTestId("registration-first-name-input");
    this.lastName = page.getByTestId("registration-last-name-input");
    this.emailAdrdress = page.getByTestId("registration-email-input");
    this.password = page.getByTestId("registration-password-input");
    this.vatId = page.getByTestId("registration-vatid-input");
    this.companyName = page.getByTestId("registration-company-input");
    this.street = page.getByTestId("registration-street-input");
    this.zipcode = page.getByTestId("registration-zipcode-input");
    this.city = page.getByTestId("registration-city-input");
    this.country = page.getByTestId("country-select");
    this.countryState = page.getByTestId("checkout-pi-state-input");
    this.submitButton = page.getByTestId("registration-submit-button");
  }

  // Define login page methods
  async fillCustomerData(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) {
    await selectFirstOptionIfPresent(this.salutation);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.emailAdrdress.fill(email);
    await this.password.fill(password);
  }

  async fillAddressData(street: string, zipcode: string, city: string) {
    await this.street.fill(street);
    await this.zipcode.fill(zipcode);
    await this.city.fill(city);
    await selectCountry(this.page, this.country, "Germany");
    await selectFirstOptionIfPresent(this.countryState);
  }

  async fillCompanyData(companyName: string, vatId: string) {
    await this.accountType.selectOption({ label: "Company" });
    await this.companyName.fill(companyName);
    await this.vatId.fill(vatId);
  }

  async submitRegistraionForm() {
    await this.submitButton.click();
    // Registration lands the customer somewhere logged in. Where exactly is
    // template routing, so wait for the form to go rather than for a URL.
    await this.page
      .getByTestId("registration-form")
      .waitFor({ state: "detached" });
  }

  async createUser() {
    await selectFirstOptionIfPresent(this.salutation);
    await this.firstName.fill(`e2e ${faker.person.firstName()}`);
    await this.lastName.fill(`e2e ${faker.person.lastName()}`);
    await this.emailAdrdress.fill(uniqueEmail());
    await this.password.fill(faker.internet.password());
    await this.street.fill(faker.location.street());
    await this.zipcode.fill(faker.location.zipCode());
    await this.city.fill(faker.location.city());
    await selectCountry(this.page, this.country, "Germany");
    await selectFirstOptionIfPresent(this.countryState);
    await this.submitRegistraionForm();
  }
}
