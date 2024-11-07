import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { CategoryPage } from "../page-objects/CategoryPage";

test.describe("Check category page", { tag: "@vue-demo-store" }, () => {
  let homePage: HomePage;
  let categoryPage: CategoryPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    categoryPage = new CategoryPage(page);

    await homePage.visitMainPage();
  });

  test("Check manufacturer filter", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(/.*manufacturer.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check random colour filter", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectRandomColorCheckbox();

    await expect(page).toHaveURL(/.*properties.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check sorting", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectSortingPriceAsc();
    await expect(page).toHaveURL(/.*order=price-asc.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check limit and pagination", async ({ page }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectLimitOneProductPerPage();
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page).toHaveURL(/.*limit.*/);
    await expect(page).toHaveURL(/.*p=1.*/);
    await categoryPage.goToSecondPage();
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page).toHaveURL(/.*p=2.*/);

    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });
});
