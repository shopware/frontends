import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { CategoryPage } from "../page-objects/CategoryPage";
import { SearchResultPage } from "../page-objects/SearchResultPage";

test.describe.only("Check filters", () => {
  let homePage: HomePage;
  let categoryPage: CategoryPage;
  let resultPage: SearchResultPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    categoryPage = new CategoryPage(page);
    resultPage = new SearchResultPage(page);

    await homePage.visitMainPage();
  });

  test("Check random manufacturer filter", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectRandomManufacturerCheckbox();
    await expect(page).toHaveURL(new RegExp(".*manufacturer.*"));
  });

  test("Check category filters", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectFilter();
    await expect(page.getByTestId("product-box-img")).toHaveCount(1);
  });

  test("Check filters on search results", async ({ page }) => {
    await homePage.typeSearchPhrase("bag");
    await resultPage.selectSearchResultsFilter();
    await expect(page.getByTestId("product-box-img")).toHaveCount(1);
  });
});
