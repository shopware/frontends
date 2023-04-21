import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { WishlistPage } from "../page-objects/WishlistPage";

test.describe.parallel
  .only("Add product to wishlist / Remove from wishlist", () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let wishlistPage: WishlistPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    wishlistPage = new WishlistPage(page);

    await homePage.visitMainPage();
  });

  test("Add product to wishlist", async ({ page }) => {
    await homePage.addProductToWishlist();
    await wishlistPage.openWishlist();
    await expect(page.getByTestId("product-box")).toHaveCount(1);
  });

  test("Remove product from wishlist", async ({ page }) => {
    await homePage.addProductToWishlist();
    await wishlistPage.openWishlist();
    await wishlistPage.removeProductFromWishlist();
    await expect(page.getByTestId("wishlist-empty")).toHaveCount(1);
  });
});
