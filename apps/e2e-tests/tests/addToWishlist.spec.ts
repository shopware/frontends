import { expect, test } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { WishlistPage } from "../page-objects/WishlistPage";

test.describe.parallel(
  "Add product to wishlist / Remove from wishlist",
  { tag: "@vue-demo-store" },
  () => {
    let homePage: HomePage;
    let wishlistPage: WishlistPage;

    // Before Hook
    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
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

    test("Clear whole wishlist", async ({ page }) => {
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await wishlistPage.clearWishlist();
      await expect(page.getByTestId("wishlist-empty")).toHaveCount(1);
    });
  },
);
