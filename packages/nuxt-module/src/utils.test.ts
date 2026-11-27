import { describe, expect, it } from "vitest";

import { isSecretConfigKey, stripSecretConfigKeys } from "./utils";

describe("isSecretConfigKey", () => {
  it.each([
    "client_id",
    "clientId",
    "CLIENT_ID",
    "client_secret",
    "clientSecret",
    "secret",
    "password",
    "adminPassword",
    "privateKey",
    "private_key",
    "adminApi",
    "adminApiCredentials",
    "admin_api_endpoint",
    "apiSecretKey",
    "secretAccessKey",
    "adminClientId",
    "adminToken",
    "apiToken",
    "bearerToken",
    "authToken",
    "auth_token",
    "refreshToken",
    "adminAccessToken",
    "integrationAccessToken",
    "apiKey",
    "x-api-key",
    "authorization",
    "Authorization",
    "accessKeyId",
    "access_key_id",
  ])("treats %s as secret", (key) => {
    expect(isSecretConfigKey(key)).toBe(true);
  });

  it.each([
    "accessToken",
    "shopwareAccessToken",
    "endpoint",
    "shopwareEndpoint",
    "devStorefrontUrl",
    "useUserContextInSSR",
    "cacheableReads",
    "apiClientConfig",
    "timeout",
    "headers",
    "sw-access-key",
    "sw-language-id",
    "username",
    "user",
    "author",
  ])("treats %s as public", (key) => {
    expect(isSecretConfigKey(key)).toBe(false);
  });
});

describe("isSecretConfigKey with a parent key", () => {
  it.each([
    ["username", "credentials"],
    ["user", "basicAuth"],
    ["user_name", "adminCredentials"],
  ])("treats %s under %s as secret", (key, parent) => {
    expect(isSecretConfigKey(key, parent)).toBe(true);
  });

  it.each([
    ["username", "profile"],
    ["user", "apiClientConfig"],
    ["accessToken", "credentials"],
    ["endpoint", "credentials"],
  ])("treats %s under %s as public", (key, parent) => {
    expect(isSecretConfigKey(key, parent)).toBe(false);
  });
});

describe("stripSecretConfigKeys", () => {
  it("removes secrets at any depth and reports their paths", () => {
    const input = {
      endpoint: "https://shop/store-api",
      accessToken: "SWSC",
      clientSecret: "x",
      nested: { credentials: { client_id: "a", client_secret: "b" }, ok: 1 },
      list: [{ password: "p", name: "n" }],
    };

    const { config, stripped, strippedPaths } = stripSecretConfigKeys(
      input,
      "shopware",
    );

    expect(config).toEqual({
      endpoint: "https://shop/store-api",
      accessToken: "SWSC",
      nested: { credentials: {}, ok: 1 },
      list: [{ name: "n" }],
    });
    expect(strippedPaths).toEqual([
      "shopware.clientSecret",
      "shopware.nested.credentials.client_id",
      "shopware.nested.credentials.client_secret",
      "shopware.list[0].password",
    ]);
    expect(stripped).toEqual({
      clientSecret: "x",
      nested: { credentials: { client_id: "a", client_secret: "b" } },
    });
  });

  it("keeps every key the module reads from public config", () => {
    const input = {
      endpoint: "https://shop/store-api",
      shopwareEndpoint: "https://shop/store-api",
      accessToken: "SWSC",
      shopwareAccessToken: "SWSC",
      devStorefrontUrl: "http://localhost:3000",
      useUserContextInSSR: true,
      cacheableReads: true,
      apiClientConfig: {
        timeout: 5000,
        headers: { "sw-language-id": "1", "sw-access-key": "SWSC" },
      },
    };

    const { config, strippedPaths } = stripSecretConfigKeys(input);

    expect(config).toEqual(input);
    expect(strippedPaths).toEqual([]);
  });

  it("strips Authorization headers and usernames under credentials", () => {
    const { config, strippedPaths } = stripSecretConfigKeys({
      apiClientConfig: { headers: { Authorization: "Bearer x", foo: "bar" } },
      credentials: { username: "admin" },
      profile: { username: "visible" },
    });

    expect(config).toEqual({
      apiClientConfig: { headers: { foo: "bar" } },
      credentials: {},
      profile: { username: "visible" },
    });
    expect(strippedPaths).toEqual([
      "apiClientConfig.headers.Authorization",
      "credentials.username",
    ]);
  });

  it("does not modify its input", () => {
    const input = { credentials: { client_secret: "b" } };

    stripSecretConfigKeys(input);

    expect(input).toEqual({ credentials: { client_secret: "b" } });
  });
});
