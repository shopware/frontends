import { expect, test } from "@playwright/test";

import { HomePage } from "../page-objects/HomePage";
import { LoginForm } from "../page-objects/LoginPage";
import { ProductPage } from "../page-objects/ProductPage";
import { findEnv } from "../utils/helpers";

require("dotenv").config({ path: findEnv() });
const userEmail = process.env.USER_EMAIL || "test@shopware.com";
const password = process.env.PASSWORD || "shopware123";

test.describe("Add review", { tag: "@storefront" }, () => {
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
  // vue-starter-template does not render product reviews at all: cms-base-layer
  // ships SwProductReviews.vue but FrontendDetailPage never uses it, so there is
  // no reviews tab to open. Needs the feature, not a selector. Tracked in
  // #2680 (#1679 covered an earlier version of this and is closed).
  test.skip("Add product review", async ({ page }) => {
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
