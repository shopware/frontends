import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { SearchResultPage } from "../page-objects/SearchResultPage";

test.describe("Check search page", { tag: "@vue-demo-store" }, () => {
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

    await expect(page).toHaveURL(/.*manufacturer.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });
  //TODO fix the issues from https://github.com/shopware/frontends/issues/1012
  test.skip("Check properties filter", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectRandomSelectionCheckbox();

    await expect(page).toHaveURL(/.*properties.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check sorting", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectSortingPriceAsc();
    await expect(page).toHaveURL(/.*order=price-asc.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check limit and pagination", async ({ page }) => {
    await homePage.typeSearchPhrase("sal");
    await resultPage.selectLimitOneProductPerPage();
    await expect(page).toHaveURL(/.*limit.*/);
    await expect(page).toHaveURL(/.*p=1.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await resultPage.goToSecondPage();
    await expect(page).toHaveURL(/.*p=2.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);

    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });
});
