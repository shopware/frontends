import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { CartPage } from "../page-objects/CartPage";

test.describe.parallel.only("Add product to cart / Remove from cart", () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);

    await homePage.visitMainPage();
  });

  test("Add product to cart", async ({ page }) => {
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await expect(page.locator("[data-testid='cart-product-image']")).toBeVisible();
  });
});
