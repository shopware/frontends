---
head:
  - - meta
    - name: og:title
      content: "Best practices: Accessbility testing"
  - - meta
    - name: og:description
      content: "Collection of good practices for integrating axe-core with Playwright for automated accessibility testing."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**Accessibiity%20Testing**.png"
nav:
  position: 10
---

# Axe Core

Axe Core is an open-source accessibility testing engine used for automated web testing. You can use it as an extension for Chrome or Firefox to scan web pages for accessibility issues and also implement it in the e2e tests used (e.g. in Playwright) and automate accessibility checks in continuous integration environments. 

## Axe Core

Playwright and e2e tests can also be used to test application for many types of accessibility issues.
By default, axe checks against a wide variety of accessibility rules, but rules can be defined easily at the test level

```js
const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
```

## Example accessibility tests

Using the ax core library is practically no different from typical work with playwright. You can create tests for each page from scratch or integrate accessibility scans and assertions into your existing test cases.


```js
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
```
You can also run tests for a specific part of the page

```js
test('navigation menu should not have automatically detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('https://your-site.com/');

  await page.getByRole('button', { name: 'Navigation Menu' }).click();

  // It is important to waitFor() the page to be in the desired
  // state *before* running analyze(). Otherwise, axe might not
  // find all the elements your test expects it to scan.
  await page.locator('#navigation-menu-flyout').waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#navigation-menu-flyout')
      .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```