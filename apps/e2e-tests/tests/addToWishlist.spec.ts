import { expect, test } from "../fixtures";

test.describe.parallel(
  "Add product to wishlist / Remove from wishlist",
  { tag: "@frontends" },
  () => {
    test.beforeEach(async ({ homePage, registrationPage }) => {
      await homePage.visitMainPage();
      // A fresh customer: the wishlist belongs to the account, and a shared one
      // accumulates entries across specs.
      await homePage.clickOnSignIn();
      await homePage.openRegistrationPage();
      await registrationPage.createUser();
    });

    test("Add product to wishlist", async ({
      page,
      homePage,
      wishlistPage,
    }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("wishlist-product-box")).toHaveCount(1);
    });

    test("Remove product from wishlist", async ({
      page,
      homePage,
      wishlistPage,
    }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("wishlist-product-box")).toHaveCount(1);
      await wishlistPage.removeProductFromWishlist();
      await expect(page.getByTestId("wishlist-empty-container")).toHaveCount(1);
    });

    test("Clear whole wishlist", async ({ page, homePage, wishlistPage }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await wishlistPage.clearWishlist();
      await expect(page.getByTestId("wishlist-empty-container")).toHaveCount(1);
    });
  },
);
