import { expect, test } from "../fixtures";

test.describe("Add review", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage, registrationPage }) => {
    await homePage.visitMainPage();
    // A fresh customer: the backend takes one review per customer and product.
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.createUser();
  });

  test("Add product review", async ({ page, homePage, productPage }) => {
    await homePage.openCartPage();
    await page.getByTestId("header-wishlist-button").waitFor();
    await productPage.fillReviewForm();
    await expect(page.getByTestId("review-success-message")).toBeVisible();
  });
});
