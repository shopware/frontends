import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

import { CartPage } from "../page-objects/CartPage";
import { CheckoutPage } from "../page-objects/CheckoutPage";
import { HomePage } from "../page-objects/HomePage";
import { ProductPage } from "../page-objects/ProductPage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { uniqueEmail, uniquePassword } from "../utils/data-helpers";
import { findEnv } from "../utils/helpers";
import { captureStoreApi } from "../utils/store-api";

// A full purchase, and ProductPage.addToCart alone budgets 60s for its retries.
require("dotenv").config({ path: findEnv() });
const userEmail = process.env.USER_EMAIL || "test@shopware.com";
const password = process.env.PASSWORD || "shopware123";

test.setTimeout(90000);

test.describe("Create Order", { tag: "@frontends" }, () => {
  let homePage: HomePage;
  let registrationPage: RegisterForm;
  let checkoutPage: CheckoutPage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
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
      uniqueEmail(),
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

  test("Create new order as a signed in customer", async ({ page }) => {
    // The checkout has no sign-in step, so establish the session first.
    await homePage.loginAs(userEmail, password);
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.markTerms();
    await checkoutPage.placeOrder();
    await page.waitForLoadState("domcontentloaded");
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });

  test("Create new order and an account", async ({ page, request }) => {
    const email = uniqueEmail();
    const accountPassword = uniquePassword();
    const storeApi = captureStoreApi(page);

    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.fillGuestUserData(
      `e2e ${faker.person.firstName()}`,
      `e2e ${faker.person.lastName()}`,
      email,
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
      accountPassword,
    );
    await checkoutPage.markTerms();
    await checkoutPage.placeOrder();
    await expect(page.getByTestId("order-total")).toHaveCount(1);

    // A guest cannot sign in, so a successful login is what proves a real
    // account was created with the password entered at checkout. Done over the
    // API: a second pass through the UI doubles the exposure to slow renders
    // without testing anything the checkout did not already cover.
    expect(storeApi.value, "no store-api traffic seen").toBeDefined();
    const signIn = await request.post(
      `${storeApi.value?.endpoint}/account/login`,
      {
        headers: {
          "sw-access-key": storeApi.value?.accessKey ?? "",
          "content-type": "application/json",
        },
        data: { username: email, password: accountPassword },
      },
    );
    expect(signIn.status(), await signIn.text()).toBe(200);
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
      uniqueEmail(),
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
