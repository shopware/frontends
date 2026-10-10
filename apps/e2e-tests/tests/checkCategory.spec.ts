import { expect, test } from "../fixtures";

test.describe("Check category page", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Check manufacturer filter", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectRandomManufacturerCheckbox();

    await expect(page).toHaveURL(/.*manufacturer.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });

  test("Check random colour filter", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectRandomColorCheckbox();

    await expect(page).toHaveURL(/.*properties.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });

  test("Check sorting", async ({ page, homePage, categoryPage }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectSortingPriceAsc();
    await expect(page).toHaveURL(/.*order=price-asc.*/);
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });

  test("Check limit and pagination", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await homePage.openCategoryPage();
    await categoryPage.selectLimitOneProductPerPage();
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page).toHaveURL(/.*limit.*/);
    await expect(page).toHaveURL(/.*p=1.*/);
    await categoryPage.goToSecondPage();
    await expect(page.getByTestId("loading")).toHaveCount(0);
    await expect(page).toHaveURL(/.*p=2.*/);

    await expect(page.getByTestId("product-box-img").first()).toBeVisible();
  });
});
