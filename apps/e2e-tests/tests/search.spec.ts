import { expect, test } from "../fixtures";
import { productSearchTerm } from "../utils/store-api";

test.describe("Search phrase", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Search phrase and verify result page", async ({
    page,
    homePage,
    searchResultPage,
    storeApi,
  }) => {
    await homePage.typeSearchPhrase(await productSearchTerm(page, storeApi));
    await expect(searchResultPage.searchResultBox).toBeVisible();
  });

  test("Search phrase by suggest and verify result page", async ({
    page,
    homePage,
    searchResultPage,
    storeApi,
  }) => {
    await homePage.searchBySuggest(await productSearchTerm(page, storeApi));
    await expect(searchResultPage.searchResultBox).toBeVisible();
  });
});
