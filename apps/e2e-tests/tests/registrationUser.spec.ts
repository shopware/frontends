import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { HomePage } from "../page-objects/HomePage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { uniqueEmail } from "../utils/data-helpers";

test.describe("Registration new user", { tag: "@frontends" }, () => {
  let homePage: HomePage;
  let registrationPage: RegisterForm;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registrationPage = new RegisterForm(page);

    await homePage.visitMainPage();
  });

  test("Registration new user", async ({ page }) => {
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.fillCustomerData(
      `e2e ${faker.person.firstName()}`,
      `e2e ${faker.person.lastName()}`,
      uniqueEmail(),
      faker.internet.password(),
    );
    await registrationPage.fillAddressData(
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
    );
    await registrationPage.submitRegistraionForm();
    // Registration signs the customer in, so the header account control
    // switches to its logged-in role.
    await expect(page.getByTestId("account-menu-hello-button")).toBeVisible();
  });

  test("Registration new user company", async ({ page }) => {
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.fillCompanyData(
      `e2e ${faker.company.name()}`,
      "DE123456789",
    );
    await registrationPage.fillCustomerData(
      `e2e ${faker.person.firstName()}`,
      `e2e ${faker.person.lastName()}`,
      uniqueEmail(),
      faker.internet.password(),
    );
    await registrationPage.fillAddressData(
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
    );
    await registrationPage.submitRegistraionForm();
    // Registration signs the customer in, so the header account control
    // switches to its logged-in role.
    await expect(page.getByTestId("account-menu-hello-button")).toBeVisible();
  });
});
