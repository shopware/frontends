import { describe, expect, test as baseTest } from "vitest";
import { createAdminAPIClient } from ".";
import { operations, operationPaths } from "../admin-api-types";

const baseURL = "https://demo-frontends.shopware.store/store-api";

const test = baseTest.extend<{
  adminApiClient: ReturnType<
    typeof createAdminAPIClient<operations, operationPaths>
  >;
}>({
  adminApiClient: async ({}, use) => {
    // setup the fixture before each test function
    const adminApiClient = createAdminAPIClient<operations, operationPaths>({
      baseURL,
    });

    // use the fixture value
    await use(adminApiClient);
  },
});

describe("Admin client session data", () => {
  test("setting session data should return changed data", async ({
    adminApiClient,
  }) => {
    const newData = adminApiClient.setSessionData({
      accessToken: "123",
      expirationTime: 456,
      refreshToken: "789",
    });

    expect(newData).toEqual({
      accessToken: "123",
      expirationTime: 456,
      refreshToken: "789",
    });
  });

  test("fresh test should have empty session data", async ({
    adminApiClient,
  }) => {
    expect(adminApiClient.getSessionData()).toEqual({
      accessToken: "",
      expirationTime: 0,
      refreshToken: "",
    });
  });

  test("setSessionData should affect getSessionData", async ({
    adminApiClient,
  }) => {
    adminApiClient.setSessionData({
      accessToken: "123",
      expirationTime: 456,
      refreshToken: "789",
    });

    expect(adminApiClient.getSessionData()).toEqual({
      accessToken: "123",
      expirationTime: 456,
      refreshToken: "789",
    });
  });
});
