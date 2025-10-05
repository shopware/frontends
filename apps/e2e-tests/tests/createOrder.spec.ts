import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { CartPage } from "../page-objects/CartPage";
import { CheckoutPage } from "../page-objects/CheckoutPage";
import { HomePage } from "../page-objects/HomePage";
import { LoginForm } from "../page-objects/LoginPage";
import { ProductPage } from "../page-objects/ProductPage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { findEnv } from "../utils/helpers";

require("dotenv").config({ path: findEnv() });
const userEmail = process.env.USER_EMAIL || "test@shopware.com";
const password = process.env.PASSWORD || "shopware123";
test.setTimeout(50000);

test.describe("Create Order", { tag: "@vue-demo-store" }, () => {
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
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    await page.waitForLoadState("networkidle");
    await registrationPage.fillCustomerData(
      `e2e ${faker.person.firstName()}`,
      `e2e ${faker.person.lastName()}`,
      faker.internet.exampleEmail(),
      faker.internet.password(),
    );
    await registrationPage.fillAddressData(
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
    );
    await registrationPage.submitRegistraionForm();
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await page.waitForSelector("[data-testid='checkout-shipping-method']");
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
      `e2e ${faker.person.firstName()}`,
      `e2e ${faker.person.lastName()}`,
      faker.internet.exampleEmail(),
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
    );
    await checkoutPage.markTerms();
    await checkoutPage.placeOrder();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });
});
