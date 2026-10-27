import { expect, test } from "../fixtures";

// Registering a fresh customer costs ~15s of the budget.
test.setTimeout(90000);
test.describe.parallel(
  "Add product to cart / Remove from cart",
  { tag: "@frontends" },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.visitMainPage();
    });

    test("Add product to cart", async ({
      page,
      homePage,
      productPage,
      cartPage,
    }) => {
      await homePage.openCartPage();
      await productPage.addToCart();
      await cartPage.openMiniCart();
      await page.getByTestId("checkout-product-tile-image").waitFor();
      await expect(
        page.getByTestId("checkout-product-tile-image"),
      ).toBeVisible();
    });

    test("Add product to cart from wishlist", async ({
      page,
      homePage,
      registrationPage,
      wishlistPage,
      cartPage,
    }) => {
      // The wishlist is server side, and a fresh customer starts empty.
      await homePage.clickOnSignIn();
      await homePage.openRegistrationPage();
      await registrationPage.createUser();
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("wishlist-product-box")).toHaveCount(1);
      await wishlistPage.addFirstProductToCart();
      await cartPage.openMiniCart();
      await expect(
        page.getByTestId("checkout-product-tile-image"),
      ).toBeVisible();
    });
  },
);
