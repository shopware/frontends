import { faker } from "@faker-js/faker";
import type { APIRequestContext } from "@playwright/test";

import { expect, test } from "../fixtures";
import { HomePage } from "../page-objects/HomePage";
import { RegisterForm } from "../page-objects/RegisterPage";
import { uniqueEmail } from "../utils/data-helpers";
import { captureStoreApi } from "../utils/store-api";
import type { StoreApi } from "../utils/store-api";

async function shopTurnsOffAccountTypeSelection(
  request: APIRequestContext,
  storeApi: { value?: StoreApi },
) {
  await expect
    .poll(() => storeApi.value, { message: "no store-api traffic seen" })
    .toBeDefined();
  const { endpoint, accessKey } = storeApi.value as StoreApi;
  const response = await request.get(`${endpoint}/shop-settings`, {
    headers: { "sw-access-key": accessKey },
  });
  if (response.status() === 404) return false;
  expect(response.status(), await response.text()).toBe(200);
  const settings = await response.json();
  return settings?.loginRegistration?.showAccountTypeSelection === false;
}

test.describe("Registration new user", { tag: "@frontends" }, () => {
  let homePage: HomePage;
  let registrationPage: RegisterForm;
  let storeApi: { value?: StoreApi };

  // Before Hook
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registrationPage = new RegisterForm(page);
    storeApi = captureStoreApi(page);

    await homePage.visitMainPage();
  });

  test("Registration new user", async ({ page }) => {
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
    // Registration signs the customer in, so the header account control
    // switches to its logged-in role.
    await expect(
      page.locator(
        '[data-testid="header-account-button"][data-logged-in="true"]',
      ),
    ).toBeVisible();
  });

  test("Registration new user company", async ({ page, request }) => {
    await homePage.clickOnSignIn();
    await homePage.openRegistrationPage();
    test.skip(
      await shopTurnsOffAccountTypeSelection(request, storeApi),
      "The shop turns off showAccountTypeSelection in its login and registration settings, so it offers no company registration",
    );
    await expect(registrationPage.accountType).toBeVisible();
    await registrationPage.fillCompanyData(
      `e2e ${faker.company.name()}`,
      "DE123456789",
    );
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
    // Registration signs the customer in, so the header account control
    // switches to its logged-in role.
    await expect(
      page.locator(
        '[data-testid="header-account-button"][data-logged-in="true"]',
      ),
    ).toBeVisible();
  });
});
