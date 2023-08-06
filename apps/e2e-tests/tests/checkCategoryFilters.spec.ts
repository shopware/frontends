import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { CategoryPage } from "../page-objects/CategoryPage";

test.describe.only("Check filters", () => {
  let homePage: HomePage;
  let categoryPage: CategoryPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    categoryPage = new CategoryPage(page);

    await homePage.visitMainPage();
  });

  test("Check category filters", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectFilter();
    await expect(page.getByTestId("product-box-img")).toHaveCount(1);
  });
});
