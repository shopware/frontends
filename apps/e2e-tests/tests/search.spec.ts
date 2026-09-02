import { expect, test } from "../fixtures";
import { HomePage } from "../page-objects/HomePage";
import { SearchResultPage } from "../page-objects/SearchResultPage";

test.describe("Search phrase", { tag: "@frontends" }, () => {
  let homePage: HomePage;
  let resultPage: SearchResultPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    resultPage = new SearchResultPage(page);

    await homePage.visitMainPage();
  });

  test("Search phrase and verify result page", async () => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await expect(resultPage.searchResultBox).toBeVisible();
  });

  test("Search phrase by suggest and verify result page", async () => {
    await homePage.searchBySuggest(await homePage.firstProductSearchTerm());
    await expect(resultPage.searchResultBox).toBeVisible();
  });
});
