import { expect, test } from "../fixtures";

test.describe("Search phrase", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Search phrase and verify result page", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await expect(searchResultPage.searchResultBox).toBeVisible();
  });

  test("Search phrase by suggest and verify result page", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage.searchBySuggest(await homePage.firstProductSearchTerm());
    await expect(searchResultPage.searchResultBox).toBeVisible();
  });
});
