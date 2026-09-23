import { test, expect } from '@playwright/test';
import AxeBuilder from "@axe-core/playwright";

//Uses normal Playwright Test syntax to define a test case
test('Check accessibility violations', async ({ page }) => {
//Uses normal Playwright syntax to navigate to the page under test
  await page.goto('https://example.com');
//Awaits AxeBuilder.analyze() to run the accessibility scan against the page
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  //Uses normal Playwright Test assertions to verify that there are no violations in the returned scan results
      expect(accessibilityScanResults.violations).toEqual([]);
