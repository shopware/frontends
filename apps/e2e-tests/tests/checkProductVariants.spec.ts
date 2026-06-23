import { test } from "@playwright/test";

import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";

test.describe.parallel(
  "Check product variants",
  { tag: "@vue-demo-store" },
  () => {
    let homePage: HomePage;
    let productPage: ProductPage;

    // Before Hook
    test.beforeEach(async ({ page }) => {
      homePage = new HomePage(page);
      productPage = new ProductPage(page);

      await homePage.visitMainPage();
    });

    test("Add product variants to cart", async () => {
      await homePage.openVariantsCartPage();
      await productPage.addVariantToCart();
    });
  },
);
