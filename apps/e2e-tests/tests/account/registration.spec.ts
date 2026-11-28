import { faker } from "@faker-js/faker";
import type { APIRequestContext } from "@playwright/test";

import { expect, test } from "../../fixtures";
import { uniqueEmail } from "../../utils/data-helpers";
import type { StoreApi } from "../../utils/store-api";

async function shopTurnsOffAccountTypeSelection(
  request: APIRequestContext,
  storeApi: { value?: StoreApi },
) {
  await expect
    .poll(() => storeApi.value, {
      message: "no store-api traffic seen",
      timeout: 30_000,
    })
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

test.describe(
  "Registration new user",
  { tag: ["@frontends", "@writes-customer"] },
  () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.visitMainPage();
    });

    test("Registration new user", async ({ homePage, registrationPage }) => {
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
      await expect(homePage.signedIn).toBeVisible();
    });

    test("Registration new user company", async ({
      request,
      storeApi,
      homePage,
      registrationPage,
    }) => {
      await homePage.clickOnSignIn();
      await homePage.openRegistrationPage();
      test.skip(
        !(await registrationPage.accountType.isVisible()) &&
          (await shopTurnsOffAccountTypeSelection(request, storeApi)),
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
      await expect(homePage.signedIn).toBeVisible();
    });
  },
);
