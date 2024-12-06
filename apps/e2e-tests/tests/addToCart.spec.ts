import { expect, test } from "@playwright/test";
import { CartPage } from "../page-objects/CartPage";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { WishlistPage } from "../page-objects/WishlistPage";

test.setTimeout(50000);
test.describe.parallel(
  "Add product to cart / Remove from cart",
  { tag: "@vue-demo-store" },
  () => {
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
      await page.getByTestId("cart-product-image").waitFor();
      await expect(page.getByTestId("cart-product-image")).toBeVisible();
    });

    test("Add product to cart from wishlist", async ({ page }) => {
      await page.waitForEvent("requestfinished");
      await homePage.addProductToWishlist();
      await wishlistPage.openWishlist();
      await expect(page.getByTestId("product-box")).toHaveCount(1);
      await productPage.addToCart();
      await cartPage.openMiniCart();
      await expect(page.getByTestId("cart-product-image")).toBeVisible();
    });
  },
);
