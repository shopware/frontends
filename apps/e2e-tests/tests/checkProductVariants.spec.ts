import { test } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { CartPage } from "../page-objects/CartPage";

test.describe.parallel.only("Check product variants", () => {
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

  test("Add product variants to cart", async ({ page }) => {
    await homePage.openVariantsCartPage();
    await productPage.addVariantToCart();
  });
});
