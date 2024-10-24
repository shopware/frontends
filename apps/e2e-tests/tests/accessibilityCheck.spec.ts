import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { HomePage } from "../page-objects/HomePage";
import { CategoryPage } from "../page-objects/CategoryPage";
import { ProductPage } from "../page-objects/ProductPage";

test.describe
  .only("Should not have any automatically detectable accessibility issues", () => {
  let homePage: HomePage;
  let productPage: ProductPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);

    await homePage.visitMainPage();
  });

  test("Check Homepage accessibility issues", async ({ page }) => {
    await homePage.visitMainPage();
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Check Category accessibility issues", async ({ page }) => {
    await homePage.visitMainPage();
    await homePage.openCategoryPage();
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Check Product Page accessibility issues", async ({ page }) => {
    await homePage.visitMainPage();
    await homePage.openCartPage();
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
