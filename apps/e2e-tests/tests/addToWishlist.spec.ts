import { expect, test } from "../fixtures";
import { HomePage } from "../page-objects/HomePage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { WishlistPage } from "../page-objects/WishlistPage";

test.describe.parallel(
  "Add product to wishlist / Remove from wishlist",
  { tag: "@frontends" },
  () => {
    let homePage: HomePage;
    let wishlistPage: WishlistPage;
    let registrationPage: RegisterForm;

    // Before Hook
    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      wishlistPage = new WishlistPage(page);
      registrationPage = new RegisterForm(page);

      await homePage.visitMainPage();
      // A fresh customer: the wishlist belongs to the account, and a shared one
      // accumulates entries across specs.
      await homePage.clickOnSignIn();
      await homePage.openRegistrationPage();
      await registrationPage.createUser();
    });

    test("Add product to wishlist", async ({ page }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("wishlist-product-box")).toHaveCount(1);
    });

    test("Remove product from wishlist", async ({ page }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("wishlist-product-box")).toHaveCount(1);
      await wishlistPage.removeProductFromWishlist();
      await expect(page.getByTestId("wishlist-empty-container")).toHaveCount(1);
    });

    // The starter has no "clear all" action. Needs the feature, see #2679.
    test.skip("Clear whole wishlist", async ({ page }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await wishlistPage.clearWishlist();
      await expect(page.getByTestId("wishlist-empty-container")).toHaveCount(1);
    });
  },
);
