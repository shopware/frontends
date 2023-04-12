import { expect, Locator, Page } from "@playwright/test";

export class RegisterForm {
  // Define selectors
  readonly page: Page;
  readonly salutation: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly emailAdrdress: Locator;
  readonly password: Locator;
  readonly street: Locator;
  readonly zipcode: Locator;
  readonly city: Locator;
  readonly country: Locator;
  readonly submitButton: Locator;

  // Init selectors using constructor
  constructor(page: Page) {
    this.page = page;
    this.salutation = page.locator(
      "[data-testid='registration-salutation-select']"
    );
    this.firstName = page.locator(
      "[data-testid='registration-first-name-input']"
    );
    this.lastName = page.locator(
      "[data-testid='registration-last-name-input']"
    );
    this.emailAdrdress = page.locator(
      "[data-testid='registration-email-input']"
    );
    this.password = page.locator("[data-testid='registration-password-input']");
    this.street = page.locator("[data-testid='registration-street-input']");
    this.zipcode = page.locator("[data-testid='registration-zipcode-input']");
    this.city = page.locator("[data-testid='registration-city-input']");
    this.country = page.locator("[data-testid='registration-country-select']");
    this.submitButton = page.locator(
      "[data-testid='registration-submit-button']"
    );
  }

  // Define login page methods
  async fillCustomerData(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.page.waitForLoadState();
    await this.salutation.selectOption({ label: "Mr." });
    await this.firstName.type(firstName);
    await this.lastName.type(lastName);
    await this.emailAdrdress.type(email);
    await this.password.type(password);
  }

  async fillAddressData(street: string, zipcode: string, city: string) {
    await this.street.type(street);
    await this.zipcode.type(zipcode);
    await this.city.type(city);
    await this.country.selectOption({ label: "Germany" });
    await this.page.waitForLoadState("load");
  }

  async submitRegistraionForm() {
    await this.page.waitForLoadState("load");
    await this.submitButton.click();
  }
}
