---
head:
  - - meta
    - name: og:title
      content: "Best practices: E2E Testing with Playwright"
  - - meta
    - name: og:description
      content: "Collection of good practices to help you cteare reliable tests with Playwright."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**E2E%20Testing**.png"
nav:
  position: 10
---

# E2E Testing with Playwright

## Page object best practice

- Use `data-testid` selectors to locate your UI elements
- Use an unambiguous name for your page object class
- The page class should only contain methods for interacting with the HTML page or component
- The page class should only contain properties and methods
- Don't create an assertion on the page object level
- A page object doesn't have to be an entire HTML page and can be a small component

## Waits best practice

Avoiding hard waits in Playwright.

```js
await page.waitFor(1000); // hard wait for 1000ms
```

Never use hard waits in production tests. However, you can use them for testing or debugging purposes.
Replace them with playwright methods like `waitForNavigation`, `waitForLoadState`, `waitForSelector`.

### Pages

Follow the PageObjects pattern for the suite template to encapsulate each internal page structure and responsibilities inside its highly cohesive class file. This allows you to define a new page object for each page as per your needs.

Don't confuse the page objects you create with actual pages in the application. Pages are a lightweight concept of a view, a set of cohesive elements living under a known browser location.

## Page objects

Each page must contain a cohesive set of locators and actions.

### Structure

## Structure e2e-tests

|- page-objects # Set of pages for the applications
|- tests # Set of tests
|- utils # Predefined helpers and their factory functions

For a page object to be as readable as possible, you must follow the below structure:

```js
import { expect, Locator, Page } from "@playwright/test";

export class LoginForm {
  // Define selectors
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly closeLoginPopup: Locator

  // Init selectors using constructor
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("[data-testid='login-email-input']");
    this.passwordInput = page.locator("[data-testid='login-password-input']");
    this.submitButton = page.locator("[data-testid='login-submit-button']");
    this.closeLoginPopup =page.locator('text=close')
  }

  // Define login page methods
  async login(username: string, password: string) {
    await this.usernameInput.type(username);
    await this.passwordInput.type(password);
    await this.submitButton.click();
  }
};
```

## data-testid attribute

You are recommended to add the custom data attributes data-testid for:

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
    page.locator("data-testid='login-errors-container']"),
  ).toBeVisible();
});
```
