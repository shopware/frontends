import { test, expect } from "@playwright/test";
import { HomePage } from "../page-objects/HomePage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { getRandomNumber } from "../utils/data-helpers";
import { CheckoutPage } from "../page-objects/CheckoutPage";
import { ProductPage } from "../page-objects/ProductPage";
import { CartPage } from "../page-objects/CartPage";
import { LoginForm } from "../page-objects/LoginPage";
import find from "find-up";
export const findEnv = () => find.sync(process.env.ENV_FILE || ".env");
import { faker } from "@faker-js/faker";

require("dotenv").config({ path: findEnv() });
const userEmail = process.env.USER_EMAIL || "test@shopware.com";
const password = process.env.PASSWORD || "shopware123";

test.describe.only("Create Order", () => {
  let homePage: HomePage;
  let registrationPage: RegisterForm;
  let checkoutPage: CheckoutPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let loginform: LoginForm;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginform = new LoginForm(page);
    cartPage = new CartPage(page);
    registrationPage = new RegisterForm(page);
    productPage = new ProductPage(page);
    checkoutPage = new CheckoutPage(page);

    await homePage.visitMainPage();
  });

  test("Create new order", async ({ page }) => {
    let randomNumber = await getRandomNumber();
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await registrationPage.fillCustomerData(
      "e2e " + faker.name.firstName(),
      "e2e " + faker.name.lastName(),
      faker.internet.exampleEmail(),
      faker.internet.password()
    );
    await registrationPage.fillAddressData(
      faker.address.street(),
      faker.address.zipCode(),
      faker.address.city()
    );
    await registrationPage.submitRegistraionForm();
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.markTerms();
    await checkoutPage.placeOrder();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });

  test("Create new order with login on checkout", async ({ page }) => {
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.loginOnCheckout();
    await loginform.login(userEmail, password);
    await page.waitForLoadState();
    await checkoutPage.markTerms();
    await checkoutPage.placeOrder();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });

  test("Create new order as a guest user", async ({ page }) => {
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.checkNotCreateAccount();
    await checkoutPage.fillGuestUserData(
      "e2e " + faker.name.firstName(),
      "e2e " + faker.name.lastName(),
      faker.internet.exampleEmail(),
      faker.address.street(),
      faker.address.zipCode(),
      faker.address.city()
    );
    await checkoutPage.markTerms();
    await checkoutPage.placeOrder();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });
});
