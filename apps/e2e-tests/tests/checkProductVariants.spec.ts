import { test } from "../fixtures";

test.describe.parallel("Check product variants", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Add product variants to cart", async ({ homePage, productPage }) => {
    await homePage.openVariantsCartPage();
    await productPage.addVariantToCart();
  });
});
