import { expect, test } from "../fixtures";
import { HomePage } from "../page-objects/HomePage";
import { LoginForm } from "../page-objects/LoginPage";

test.describe("Login user", { tag: "@frontends" }, () => {
  let homePage: HomePage;
  let loginForm: LoginForm;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginForm = new LoginForm(page);

    await homePage.visitMainPage();
  });

  test("Login user", async ({ page, customer }) => {
    await homePage.clickOnSignIn();
    await loginForm.login(customer.email, customer.password);
    await page.waitForLoadState("networkidle");
    await expect(
      page.locator(
        '[data-testid="header-account-button"][data-logged-in="true"]',
      ),
    ).toHaveCount(1);
  });
});
