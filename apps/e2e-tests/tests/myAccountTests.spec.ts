import { expect, test } from "../fixtures";
import { HomePage } from "../page-objects/HomePage";
import { MyAccountPage } from "../page-objects/MyAccountPage";
import { RegisterForm } from "../page-objects/RegisterPage";

// Registers a customer before it can change anything, which the 60s default
// does not leave room for.
test.setTimeout(90000);

test.describe.parallel(
  "My account functionalities tests",
  { tag: "@frontends" },
  () => {
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
      await registrationPage.createUser();
      await homePage.openMyAccount();
      await myAccountPage.changePersonalData();
      await myAccountPage.changePersonalFirstName("test first name");
      await myAccountPage.changePersonalLastName("test last name");
      expect(
        await page
          .getByTestId("account-personal-data-firstname-input")
          .inputValue(),
      ).toEqual("test first name");
      expect(
        await page
          .getByTestId("account-personal-data-lastname-input")
          .inputValue(),
      ).toEqual("test last name");
    });
  },
);
