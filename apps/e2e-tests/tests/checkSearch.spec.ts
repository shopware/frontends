import { expect, test } from "../fixtures";
import { HomePage } from "../page-objects/HomePage";
import { SearchResultPage } from "../page-objects/SearchResultPage";

test.describe("Check search page", { tag: "@frontends" }, () => {
  let homePage: HomePage;
  let resultPage: SearchResultPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    resultPage = new SearchResultPage(page);

    await homePage.visitMainPage();
  });

  test("Check manufacturer filter", async ({ page }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await resultPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(/.*manufacturer.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });
  // Was skipped for #1012. Passes against vue-starter-template now that the
  // property filter is found by elimination rather than by name.
  test("Check properties filter", async ({ page }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await resultPage.selectRandomSelectionCheckbox();

    await expect(page).toHaveURL(/.*properties.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });

  test("Check sorting", async ({ page }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await resultPage.selectSortingPriceAsc();
    await expect(page).toHaveURL(/.*order=price-asc.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    expect(await page.getByTestId("product-box-img").count()).toBeGreaterThan(
      0,
    );
  });
  // Was skipped for #1678. Passes now that the limit and page changes wait
  // for the listing to re-render.
  test("Check limit and pagination", async ({ page }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
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
