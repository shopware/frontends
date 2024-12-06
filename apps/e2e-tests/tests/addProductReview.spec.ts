import { expect, test } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { LoginForm } from "../page-objects/LoginPage";
import { ProductPage } from "../page-objects/ProductPage";
import { findEnv } from "../utils/helpers";

require("dotenv").config({ path: findEnv() });
const userEmail = process.env.USER_EMAIL || "test@shopware.com";
const password = process.env.PASSWORD || "shopware123";

test.describe("Add review", { tag: "@vue-demo-store" }, () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let loginform: LoginForm;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginform = new LoginForm(page);
    productPage = new ProductPage(page);

    await homePage.visitMainPage();
  });

  test("Add product review", async ({ page }) => {
    await homePage.clickOnSignIn();
    await loginform.login(userEmail, password);
    await page.waitForLoadState("networkidle");
    await homePage.openCartPage();
    await page.waitForLoadState("networkidle");
    await productPage.fillReviewForm();
    await expect(
      page.getByText("Thank you for submitting your review"),
    ).toHaveCount(1);
  });
});
