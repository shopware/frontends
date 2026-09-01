import { expect, test } from "@playwright/test";

import { CartPage } from "../page-objects/CartPage";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { WishlistPage } from "../page-objects/WishlistPage";

// Registering a fresh customer in beforeEach costs ~15s of the budget.
test.setTimeout(60000);
test.describe.parallel(
  "Add product to cart / Remove from cart",
  { tag: "@frontends" },
  () => {
    let homePage: HomePage;
    let productPage: ProductPage;
    let cartPage: CartPage;
    let wishlistPage: WishlistPage;
    let registrationPage: RegisterForm;

    // Before Hook
    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      productPage = new ProductPage(page);
      cartPage = new CartPage(page);
      wishlistPage = new WishlistPage(page);
      registrationPage = new RegisterForm(page);

      await homePage.visitMainPage();
    });

    test("Add product to cart", async ({ page }) => {
      await homePage.openCartPage();
      await productPage.addToCart();
      await cartPage.openMiniCart();
      await page.getByTestId("cart-product-image").waitFor();
      await expect(page.getByTestId("cart-product-image")).toBeVisible();
    });

    test("Add product to cart from wishlist", async ({ page }) => {
      // The wishlist is server side, and a fresh customer starts empty.
      await homePage.clickOnSignIn();
      await homePage.openRegistrationPage();
      await registrationPage.createUser();
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("product-box")).toHaveCount(1);
      await wishlistPage.addFirstProductToCart();
      await cartPage.openMiniCart();
      await expect(page.getByTestId("cart-product-image")).toBeVisible();
    });
  },
);
