import { expect, test } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { SearchResultPage } from "../page-objects/SearchResultPage";

test.describe("Search phrase", { tag: "@vue-demo-store" }, () => {
  let homePage: HomePage;
  let resultPage: SearchResultPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    resultPage = new SearchResultPage(page);

    await homePage.visitMainPage();
  });

  test("Search phrase and verify result page", async ({ page }) => {
    await homePage.typeSearchPhrase("bag");
    await resultPage.searchResultBox.isVisible();
  });

  test("Search phrase by suggest and verify result page", async ({ page }) => {
    await homePage.searchBySuggest("bag");
    await resultPage.searchResultBox.isVisible();
  });
});
