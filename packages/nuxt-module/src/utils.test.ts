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
  ])("treats %s as public", (key) => {
    expect(isSecretConfigKey(key)).toBe(false);
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

    const { config, strippedPaths } = stripSecretConfigKeys(input, "shopware");

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
  });

  it("does not modify its input", () => {
    const input = { credentials: { client_secret: "b" } };

    stripSecretConfigKeys(input);

    expect(input).toEqual({ credentials: { client_secret: "b" } });
  });
});
