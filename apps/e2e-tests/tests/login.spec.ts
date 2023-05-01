import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { LoginForm } from "../page-objects/LoginPage";
import find from "find-up";
export const findEnv = () => find.sync(process.env.ENV_FILE || ".env");

require("dotenv").config({ path: findEnv() });
const userEmail = process.env.USER_EMAIL || "test@shopware.com";
const password = process.env.PASSWORD || "shopware123";

test.describe.only("Login user", () => {
  let homePage: HomePage;
  let loginForm: LoginForm;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginForm = new LoginForm(page);

    await homePage.visitMainPage();
  });

  test("Login user", async ({ page }) => {
    await homePage.clickOnSignIn();
    await loginForm.login(userEmail, password);
    await page.waitForLoadState("load");
    await expect(page.getByTestId("account-menu-hello-button")).toHaveCount(1);
  });
});
