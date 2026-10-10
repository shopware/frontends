import { expect, test } from "../fixtures";

test.describe("Check search page", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Check manufacturer filter", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await searchResultPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(/.*manufacturer.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });
  // Was skipped for #1012. Passes against vue-starter-template now that the
  // property filter is found by elimination rather than by name.
  test("Check properties filter", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await searchResultPage.selectRandomSelectionCheckbox();

    await expect(page).toHaveURL(/.*properties.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });

  test("Check sorting", async ({ page, homePage, searchResultPage }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await searchResultPage.selectSortingPriceAsc();
    await expect(page).toHaveURL(/.*order=price-asc.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });
  // Was skipped for #1678. Passes now that the limit and page changes wait
  // for the listing to re-render.
  test("Check limit and pagination", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await homePage.typeSearchPhrase(await homePage.firstProductSearchTerm());
    await searchResultPage.selectLimitOneProductPerPage();
    await expect(page).toHaveURL(/.*limit.*/);
    await expect(page).toHaveURL(/.*p=1.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await searchResultPage.goToSecondPage();
    await expect(page).toHaveURL(/.*p=2.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);

    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });
});
