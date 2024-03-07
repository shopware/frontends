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

  test("Check category manufacturer filter", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(new RegExp(".*manufacturer.*"));
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check category Colour filter", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectRandomColorCheckbox();

    await expect(page).toHaveURL(new RegExp(".*properties.*"));
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check search manufacturer filter", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(new RegExp(".*manufacturer.*"));
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check search Selection filter", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectRandomSelectionCheckbox();

    await expect(page).toHaveURL(new RegExp(".*properties.*"));
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });
});
