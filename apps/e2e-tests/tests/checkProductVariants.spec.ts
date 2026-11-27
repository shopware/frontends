import { test } from "../fixtures";
import { variantProductId } from "../utils/store-api";

test.describe.parallel("Check product variants", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Add product variants to cart", async ({
    page,
    storeApi,
    productPage,
  }) => {
    await productPage.open(await variantProductId(page, storeApi));
    await productPage.addVariantToCart();
  });
});
