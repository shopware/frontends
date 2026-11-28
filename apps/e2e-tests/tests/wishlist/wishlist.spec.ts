import { expect, test } from "../../fixtures";

test.describe.parallel(
  "Add product to wishlist / Remove from wishlist",
  { tag: ["@frontends", "@writes-customer", "@ff:wishlist"] },
  () => {
    test.beforeEach(async ({ homePage, registrationPage }) => {
      await homePage.visitMainPage();
      // A fresh customer: the wishlist belongs to the account, and a shared one
      // accumulates entries across specs.
      await homePage.clickOnSignIn();
      await homePage.openRegistrationPage();
      await registrationPage.createUser();
    });

    test("Add product to wishlist", async ({ homePage, wishlistPage }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(wishlistPage.productBoxes).toHaveCount(1);
    });

    test("Remove product from wishlist", async ({ homePage, wishlistPage }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(wishlistPage.productBoxes).toHaveCount(1);
      await wishlistPage.removeProductFromWishlist();
      await expect(wishlistPage.emptyContainer).toHaveCount(1);
    });

    test("Clear whole wishlist", async ({ homePage, wishlistPage }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await wishlistPage.clearWishlist();
      await expect(wishlistPage.emptyContainer).toHaveCount(1);
    });
  },
);
