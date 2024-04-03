import { test } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { faker } from "@faker-js/faker";

test.describe.only("Registration new user", () => {
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
      "e2e " + faker.person.firstName(),
      "e2e " + faker.person.lastName(),
      faker.internet.exampleEmail(),
      faker.internet.password(),
    );
    await registrationPage.fillAddressData(
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
    );
    await registrationPage.submitRegistraionForm();
    await page.waitForLoadState("load");
    await page.locator("header-sing-out-link").nth(1).isVisible();
  });

  test("Registration new user company", async ({ page }) => {
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.fillCompanyData(
      "e2e " + faker.company.name(),
      "DE123456789",
    );
    await registrationPage.fillCustomerData(
      "e2e " + faker.person.firstName(),
      "e2e " + faker.person.lastName(),
      faker.internet.exampleEmail(),
      faker.internet.password(),
    );
    await registrationPage.fillAddressData(
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
    );
    await registrationPage.submitRegistraionForm();
    await page.waitForLoadState("load");
    await page.locator("header-sing-out-link").nth(1).isVisible();
  });
});
