import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { getRandomNumber } from "../utils/data-helpers";
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
    // let randomNumber = await getRandomNumber();
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.fillCustomerData(
      "e2e "+faker.name.firstName(),
      "e2e "+faker.name.lastName(),
      faker.internet.exampleEmail(),
      faker.internet.password()
    );
    await registrationPage.fillAddressData(
      faker.address.street(),
      faker.address.zipCode(),
      faker.address.city()
    );
    await registrationPage.submitRegistraionForm();
    await page.locator("text =  Sign out ").isVisible();
  });
});
