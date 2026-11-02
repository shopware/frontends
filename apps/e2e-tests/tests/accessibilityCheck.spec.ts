import AxeBuilder from "@axe-core/playwright";

import { expect, test } from "../fixtures";

test.describe(
  "Should not have any automatically detectable accessibility issues",
  { tag: "@accessibility" },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.visitMainPage();
    });

    test("Check Homepage accessibility issues", async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(["heading-order", "page-has-heading-one"])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("Check Category accessibility issues", async ({ page, homePage }) => {
      await homePage.openFirstCategoryPage();
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(["heading-order", "page-has-heading-one"])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test("Check Product Page accessibility issues", async ({
      page,
      homePage,
    }) => {
      await homePage.openFirstCategoryPage();
      await homePage.openFirstProductPage();
      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(["heading-order", "page-has-heading-one"])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  },
);
