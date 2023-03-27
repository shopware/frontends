import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { MyAccountPage } from "../page-objects/MyAccountPage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { faker } from "@faker-js/faker";

test.describe.parallel
  .only("My account functionalities tests", () => {
  let homePage: HomePage;
  let myAccountPage: MyAccountPage;
  let registrationPage: RegisterForm;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    myAccountPage = new MyAccountPage(page);
    registrationPage = new RegisterForm(page);

    await homePage.visitMainPage();
  });

  test("Change personal data", async ({ page }) => {
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage(); 
    await registrationPage.createUser()
    await homePage.openMyAccount()
    await myAccountPage.changePersonalData()
    await myAccountPage.changePersonalFirstName("test first name")
    await myAccountPage.changePersonalLastName("test last name")
    await expect(page.locator("[data-testid='account-personal-data-firstname-input']")).toHaveText("test first name");
    await expect(page.locator("[data-testid='account-personal-data-lastname-input']")).toHaveText("test last name");
  });

});