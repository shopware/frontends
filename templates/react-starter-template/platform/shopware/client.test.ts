import { createAPIClient } from "@shopware/api-client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createShopwareClient } from "./client";

vi.mock("server-only", () => ({}));

vi.mock("@shopware/api-client", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@shopware/api-client")>();
  return { ...original, createAPIClient: vi.fn(original.createAPIClient) };
});

vi.mock("./config", () => ({
  getShopwareConfig: () => ({
    endpoint: "https://shop.test/store-api/",
    publicEndpoint: "https://shop.test/store-api/",
    accessToken: "SWSCTEST",
    devStorefrontUrl: null,
  }),
}));

function clientOptions() {
  return vi.mocked(createAPIClient).mock.lastCall?.[0];
}

beforeEach(() => {
  vi.mocked(createAPIClient).mockClear();
  for (const name of [
    "SHOPWARE_API_TIMEOUT",
    "SHOPWARE_API_HEADERS",
    "SHOPWARE_PUBLIC_API_HEADERS",
  ]) {
    vi.stubEnv(name, "");
  }
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

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

  it("gives every call a 10 second timeout by default", () => {
    createShopwareClient();

    expect(clientOptions()?.fetchOptions).toEqual({ timeout: 10_000 });
  });

  it("uses SHOPWARE_API_TIMEOUT as the timeout of every call", () => {
    vi.stubEnv("SHOPWARE_API_TIMEOUT", "2500");

    createShopwareClient();

    expect(clientOptions()?.fetchOptions).toEqual({ timeout: 2500 });
  });

  it("sets no timeout with SHOPWARE_API_TIMEOUT=0", () => {
    vi.stubEnv("SHOPWARE_API_TIMEOUT", "0");

    createShopwareClient();

    expect(clientOptions()?.fetchOptions).toBeUndefined();
  });

  it("sends the configured headers next to the language header", () => {
    vi.stubEnv(
      "SHOPWARE_PUBLIC_API_HEADERS",
      '{"x-edge":"public","authorization":"Basic cHVibGlj"}',
    );
    vi.stubEnv("SHOPWARE_API_HEADERS", '{"Authorization":"Basic c2VjcmV0"}');

    const client = createShopwareClient({ languageId: "language-de" });

    expect(client.defaultHeaders).toMatchObject({
      authorization: "Basic c2VjcmV0",
      "x-edge": "public",
      "sw-language-id": "language-de",
      "sw-access-key": "SWSCTEST",
    });
  });

  it("keeps its own access key, context token and language when the variables try to replace them", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv(
      "SHOPWARE_API_HEADERS",
      '{"sw-access-key":"SWSCOTHER","SW-Context-Token":"stolen","sw-language-id":"language-pl","accept":"text/html"}',
    );

    const client = createShopwareClient({
      contextToken: "token-1",
      languageId: "language-de",
    });

    expect(client.defaultHeaders["sw-access-key"]).toBe("SWSCTEST");
    expect(client.defaultHeaders["sw-context-token"]).toBe("token-1");
    expect(client.defaultHeaders["sw-language-id"]).toBe("language-de");
    expect(client.defaultHeaders.accept).toBe("application/json");
    expect(Object.values(client.defaultHeaders)).not.toContain("stolen");
  });

  it("keeps the configured headers out of a client's header changes", () => {
    vi.stubEnv("SHOPWARE_API_HEADERS", '{"x-edge":"server"}');

    const first = createShopwareClient();
    first.defaultHeaders["x-edge"] = "changed";
    const second = createShopwareClient();

    expect(second.defaultHeaders["x-edge"]).toBe("server");
  });
});
