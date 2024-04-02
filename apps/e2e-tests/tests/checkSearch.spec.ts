import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { SearchResultPage } from "../page-objects/SearchResultPage";

test.describe.only("Check search page", () => {
  let homePage: HomePage;
  let resultPage: SearchResultPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    resultPage = new SearchResultPage(page);

    await homePage.visitMainPage();
  });

  test("Check manufacturer filter", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(new RegExp(".*manufacturer.*"));
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check properties filter", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectRandomSelectionCheckbox();

    await expect(page).toHaveURL(new RegExp(".*properties.*"));
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check sorting", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectSortingPriceAsc();
    await expect(page).toHaveURL(new RegExp(".*order=price-asc.*"));
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check limit and pagination", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectLimitOneProductPerPage();
    await expect(page).toHaveURL(new RegExp(".*limit.*"));
    await expect(page).toHaveURL(new RegExp(".*p=1.*"));
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await resultPage.goToSecondPage();
    await expect(page).toHaveURL(new RegExp(".*p=2.*"));
    await expect(page.getByTestId("loading")).toHaveCount(0);

    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });
});
