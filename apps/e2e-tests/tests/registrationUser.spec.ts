import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { getRandomNumber } from "../utils/data-helpers";

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
    let randomNumber = await getRandomNumber();
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.fillCustomerData(
      "firstName",
      "lastName",
      "k.stala+" + randomNumber + "@shopware.com",
      "zaq1@WSX"
    );
    await registrationPage.fillAddressData("street", "1245", "city");
    await registrationPage.submitRegistraionForm();
    await page.locator("text =  Sign out ").isVisible();
  });
});
