import { expect, test } from "../fixtures";

// Registers a customer before it can change anything, which the 60s default
// does not leave room for.
test.setTimeout(90000);

test.describe.parallel(
  "My account functionalities tests",
  { tag: "@frontends" },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.visitMainPage();
    });

    test("Change personal data", async ({
      homePage,
      myAccountPage,
      registrationPage,
    }) => {
      await homePage.clickOnSignIn();
      await homePage.openRegistrationPage();
      await registrationPage.createUser();
      await homePage.openMyAccount();
      await myAccountPage.changePersonalData();
      await myAccountPage.changePersonalFirstName("test first name");
      await myAccountPage.changePersonalLastName("test last name");
      await expect(myAccountPage.personalFirstName).toHaveValue(
        "test first name",
      );
      await expect(myAccountPage.personalLastName).toHaveValue(
        "test last name",
      );
    });
  },
);
