import { faker } from "@faker-js/faker";

import { expect, test } from "../fixtures";
import { uniqueEmail, uniquePassword } from "../utils/data-helpers";

// A full purchase, and ProductPage.addToCart alone budgets 60s for its retries.
test.setTimeout(90000);

test.describe("Create Order", { tag: "@frontends" }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.visitMainPage();
  });

  test("Create new order", async ({
    page,
    homePage,
    registrationPage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
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
    await registrationPage.submitRegistrationForm();
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await page
      .getByTestId("checkout-shipping-method")
      .first()
      .waitFor({ state: "visible" });
    await checkoutPage.placeOrder();
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });

  test("Create new order as a signed in customer", async ({
    page,
    customer,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    // The checkout has no sign-in step, so establish the session first.
    await homePage.loginAs(customer.email, customer.password);
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.placeOrder();
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });

  test("Create new order and an account", async ({
    page,
    request,
    storeApi,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    const email = uniqueEmail();
    const accountPassword = uniquePassword();

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
    await checkoutPage.placeOrder();
    await expect(page.getByTestId("order-total")).toHaveCount(1);

    // A guest cannot sign in, so this proves a real account. Over the API: a
    // second pass through the UI only adds exposure to slow renders.
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

  test("Create new order as a guest user", async ({
    page,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await homePage.openCartPage();
    await productPage.addToCart();
    await cartPage.openMiniCart();
    await checkoutPage.goToCheckout();
    await checkoutPage.fillGuestUserData(
      `e2e ${faker.person.firstName()}`,
      `e2e ${faker.person.lastName()}`,
      uniqueEmail(),
      faker.location.street(),
      faker.location.zipCode(),
      faker.location.city(),
    );
    await checkoutPage.placeOrder();
    await expect(page.getByTestId("order-total")).toHaveCount(1);
  });
});
