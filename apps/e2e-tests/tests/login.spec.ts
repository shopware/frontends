import { expect, test } from "../fixtures";

test.describe("Login user", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Login user", async ({ page, customer, homePage, loginForm }) => {
    await homePage.clickOnSignIn();
    await loginForm.login(customer.email, customer.password);
    await expect(
      page.locator(
        '[data-testid="header-account-button"][data-logged-in="true"]',
      ),
    ).toHaveCount(1, { timeout: 30_000 });
  });
});
