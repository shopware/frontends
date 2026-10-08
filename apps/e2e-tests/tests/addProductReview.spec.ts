import { expect, test } from "../fixtures";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { RegisterForm } from "../page-objects/RegisterPage";

test.describe("Add review", { tag: "@frontends" }, () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let registrationPage: RegisterForm;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    registrationPage = new RegisterForm(page);

    await homePage.visitMainPage();
    // A fresh customer: the backend takes one review per customer and product.
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.createUser();
  });

  test("Add product review", async ({ page }) => {
    await homePage.openCartPage();
    await page.waitForLoadState("networkidle");
    await productPage.fillReviewForm();
    await expect(page.getByTestId("review-success-message")).toBeVisible();
  });
});
