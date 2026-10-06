import { describe, expect, it, vi } from "vitest";

import { createShopwareClient } from "./client";

vi.mock("server-only", () => ({}));

vi.mock("./config", () => ({
  getShopwareConfig: () => ({
    endpoint: "https://shop.test/store-api/",
    publicEndpoint: "https://shop.test/store-api/",
    accessToken: "SWSCTEST",
    devStorefrontUrl: null,
  }),
}));

describe("createShopwareClient", () => {
  it("creates an anonymous client without a language header by default", () => {
    const client = createShopwareClient();

    expect(client.defaultHeaders["sw-access-key"]).toBe("SWSCTEST");
    expect(client.defaultHeaders["sw-context-token"]).toBeUndefined();
    expect(client.defaultHeaders["sw-language-id"]).toBeUndefined();
  });

  it("sends the language id when one is given", () => {
    const client = createShopwareClient({ languageId: "language-de" });

    expect(client.defaultHeaders["sw-language-id"]).toBe("language-de");
  });

  it("leaves the language header out for a null language id", () => {
    const client = createShopwareClient({ languageId: null });

    expect(client.defaultHeaders["sw-language-id"]).toBeUndefined();
  });

  it("adopts the given context token", () => {
    const client = createShopwareClient({ contextToken: "token-1" });

    expect(client.defaultHeaders["sw-context-token"]).toBe("token-1");
  });
});
