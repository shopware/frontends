---
head:
  - - meta
    - name: og:title
      content: "Best practices: Testing"
  - - meta
    - name: og:description
      content: "Collection of good practices to help you provide a reliable application."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**Testing**.png?fontSize=130px"
---

# Testing

## data-testid attribute

Our recommendation is to add the custom data attributes `data-testid` for:

- Active elements (buttons, links, forms etc.)
- Passive elements (essential elements like price, product options etc.)

The main benefit of adding those attributes is that you can easily get elements in E2E tests.

### Naming convention

```
data-testid="{scope}-{name}-{type}"
data-testid="header-search-input"
```

**Scope** - indicates where the element is placed. For example - page
**Name** - defines the element. For example - input name
**Type** - indicates the type of element. For example - input

### Usage in tests

```js
import { test, expect } from "@playwright/test";

test("failed login", async ({ page }) => {
  await page.goto("/");

  await Promise.all([
    page.waitForNavigation(),
    page.click("[data-testid='header-sign-in-link']"),
  ]);

  await page
    .locator("[data-testid='login-email-input']")
    .fill("test@shopware.com");
  await page
    .locator("[data-testid='login-password-input']")
    .fill("Password123!@#");

  await Promise.all([await page.click("[data-testid='login-submit-button']")]);

  await expect(
    page.locator("data-testid='login-errors-container']")
  ).toBeVisible();
});
```
