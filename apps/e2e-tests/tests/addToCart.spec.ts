import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { CartPage } from "../page-objects/CartPage";
import { WishlistPage } from "../page-objects/WishlistPage";

test.describe.parallel.only("Add product to cart / Remove from cart", () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let wishlistPage: WishlistPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    wishlistPage = new WishlistPage(page);

    await homePage.visitMainPage();
  });

  test("Add product to cart", async ({ page }) => {
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await expect(page.getByTestId("cart-product-image")).toBeVisible();
  });

  test("Add product to cart from wishlist", async ({ page }) => {
    await homePage.addProductToWishlist();
    await wishlistPage.openWishlist();
    await expect(page.getByTestId("product-box")).toHaveCount(1);
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await expect(page.getByTestId("cart-product-image")).toBeVisible();
  });
});
