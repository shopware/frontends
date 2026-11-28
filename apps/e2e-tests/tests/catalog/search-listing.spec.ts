import { expect, test } from "../../fixtures";
import { productSearchTerm } from "../../utils/store-api";

test.describe("Check search page", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Check manufacturer filter", async ({
    page,
    homePage,
    searchResultPage,
    storeApi,
  }) => {
    await homePage.typeSearchPhrase(await productSearchTerm(page, storeApi));
    await searchResultPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(/.*manufacturer.*/);
    await expect(searchResultPage.loading).toHaveCount(0);
    await expect(searchResultPage.productImages.first()).toBeVisible();
  });
  // Was skipped for #1012. Passes against vue-starter-template now that the
  // property filter is found by elimination rather than by name.
  test("Check properties filter", async ({
    page,
    homePage,
    searchResultPage,
    storeApi,
  }) => {
    await homePage.typeSearchPhrase(await productSearchTerm(page, storeApi));
    await searchResultPage.selectRandomSelectionCheckbox();

    await expect(page).toHaveURL(/.*properties.*/);
    await expect(searchResultPage.loading).toHaveCount(0);
    await expect(searchResultPage.productImages.first()).toBeVisible();
  });

  test("Check sorting", async ({
    page,
    homePage,
    searchResultPage,
    storeApi,
  }) => {
    await homePage.typeSearchPhrase(await productSearchTerm(page, storeApi));
    await searchResultPage.selectSortingPriceAsc();
    await expect(page).toHaveURL(/.*order=price-asc.*/);
    await expect(searchResultPage.loading).toHaveCount(0);
    await expect(searchResultPage.productImages.first()).toBeVisible();
  });
  // Was skipped for #1678. Passes now that the limit and page changes wait
  // for the listing to re-render.
  test("Check limit and pagination", async ({
    page,
    homePage,
    searchResultPage,
    storeApi,
  }) => {
    await homePage.typeSearchPhrase(await productSearchTerm(page, storeApi));
    await searchResultPage.selectLimitOneProductPerPage();
    await expect(page).toHaveURL(/.*limit.*/);
    await expect(page).toHaveURL(/.*p=1.*/);
    await expect(searchResultPage.loading).toHaveCount(0);
    await searchResultPage.goToSecondPage();
    await expect(page).toHaveURL(/.*p=2.*/);
    await expect(searchResultPage.loading).toHaveCount(0);

    await expect(searchResultPage.productImages.first()).toBeVisible();
  });
});
