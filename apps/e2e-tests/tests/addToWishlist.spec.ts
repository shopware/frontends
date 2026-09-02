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
      await expect(page.getByTestId("product-box")).toHaveCount(1);
    });

    test("Remove product from wishlist", async ({ page }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("product-box")).toHaveCount(1);
      await wishlistPage.removeProductFromWishlist();
      await expect(page.getByTestId("wishlist-empty")).toHaveCount(1);
    });

    // vue-starter-template's wishlist page offers no "clear all" action, so
    // there is nothing for this to drive. Needs the feature, not a selector.
    // Tracked in #2679.
    test.skip("Clear whole wishlist", async ({ page }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await wishlistPage.clearWishlist();
      await expect(page.getByTestId("wishlist-empty")).toHaveCount(1);
    });
  },
);
