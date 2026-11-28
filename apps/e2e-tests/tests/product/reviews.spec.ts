import { expect, test } from "../../fixtures";

test.describe("Add review", { tag: ["@frontends", "@writes-customer"] }, () => {
  test.beforeEach(async ({ homePage, registrationPage }) => {
    await homePage.visitMainPage();
    // A fresh customer: the backend takes one review per customer and product.
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.createUser();
  });

  test("Add product review", async ({
    homePage,
    productPage,
    wishlistPage,
  }) => {
    await homePage.openCartPage();
    await wishlistPage.wishlistButton.waitFor();
    await productPage.fillReviewForm();
    await expect(productPage.reviewSuccessMessage).toBeVisible();
  });
});
