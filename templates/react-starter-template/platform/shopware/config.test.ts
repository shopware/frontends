import { afterEach, describe, expect, it, vi } from "vitest";

import { getShopwareConfig } from "./config";

vi.mock("server-only", () => ({}));

const DEMO_ENDPOINT = "https://demo-frontends.shopware.store/store-api/";

function stubShopwareEnv(env: Record<string, string>) {
  for (const name of [
    "SHOPWARE_ENDPOINT",
    "SHOPWARE_PUBLIC_ENDPOINT",
    "SHOPWARE_ACCESS_TOKEN",
    "SHOPWARE_DEV_STOREFRONT_URL",
    "SHOPWARE_MEDIA_ORIGIN",
  ]) {
    vi.stubEnv(name, env[name] ?? "");
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

async function freshConfigModule() {
  vi.resetModules();
  return import("./config");
}

describe("getShopwareConfig", () => {
  it("falls back to the demo backend, its dev storefront URL and its media CDN", () => {
    stubShopwareEnv({});

    expect(getShopwareConfig()).toEqual({
      endpoint: DEMO_ENDPOINT,
      publicEndpoint: DEMO_ENDPOINT,
      accessToken: "SWSCNWDGMUWZM0TLVUU0YKLQVW",
      devStorefrontUrl: "https://demo-frontends.shopware.store/figma",
      mediaOrigin: "https://cdn.shopware.store",
    });
  });

  it("uses the server endpoint for the browser when no public one is set", () => {
    stubShopwareEnv({
      SHOPWARE_ENDPOINT: "https://shop.example.com/store-api/",
      SHOPWARE_ACCESS_TOKEN: "SWSCOWN",
    });

    expect(getShopwareConfig()).toEqual({
      endpoint: "https://shop.example.com/store-api/",
      publicEndpoint: "https://shop.example.com/store-api/",
      accessToken: "SWSCOWN",
      devStorefrontUrl: null,
      mediaOrigin: null,
    });
  });

  it("takes the media origin from SHOPWARE_MEDIA_ORIGIN, also for the demo backend", () => {
    stubShopwareEnv({ SHOPWARE_MEDIA_ORIGIN: "https://media.example.com" });

    expect(getShopwareConfig().mediaOrigin).toBe("https://media.example.com");

    stubShopwareEnv({
      SHOPWARE_ENDPOINT: "https://shop.example.com/store-api/",
      SHOPWARE_MEDIA_ORIGIN: "https://cdn.example.com",
    });

    expect(getShopwareConfig().mediaOrigin).toBe("https://cdn.example.com");
  });

  it("keeps the public endpoint and the dev storefront URL apart from the server endpoint", () => {
    stubShopwareEnv({
      SHOPWARE_ENDPOINT: "http://shopware.internal/store-api/",
      SHOPWARE_PUBLIC_ENDPOINT: "https://shop.example.com/store-api/",
      SHOPWARE_DEV_STOREFRONT_URL: "https://shop.example.com/en",
    });

    expect(getShopwareConfig()).toMatchObject({
      endpoint: "http://shopware.internal/store-api/",
      publicEndpoint: "https://shop.example.com/store-api/",
      devStorefrontUrl: "https://shop.example.com/en",
    });
  });
});

describe("getShopwareConfig demo leftovers", () => {
  it("warns once when the browser would still call the demo backend for your own instance", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    stubShopwareEnv({
      SHOPWARE_ENDPOINT: "https://shop.example.com/store-api/",
      SHOPWARE_ACCESS_TOKEN: "SWSCOWN",
      SHOPWARE_PUBLIC_ENDPOINT: DEMO_ENDPOINT,
      SHOPWARE_DEV_STOREFRONT_URL:
        "https://demo-frontends.shopware.store/figma",
    });
    const { getShopwareConfig: readConfig } = await freshConfigModule();

    readConfig();
    readConfig();

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain(
      "SHOPWARE_PUBLIC_ENDPOINT and SHOPWARE_DEV_STOREFRONT_URL",
    );
  });

  it("names only the leftover that points at the demo backend", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    stubShopwareEnv({
      SHOPWARE_ENDPOINT: "https://shop.example.com/store-api/",
      SHOPWARE_DEV_STOREFRONT_URL:
        "https://demo-frontends.shopware.store/figma",
    });
    const { getShopwareConfig: readConfig } = await freshConfigModule();

    readConfig();

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).not.toContain("SHOPWARE_PUBLIC_ENDPOINT");
    expect(warn.mock.calls[0]?.[0]).toContain("SHOPWARE_DEV_STOREFRONT_URL");
  });

  it.each([
    ["the demo backend", {}],
    [
      "your own instance",
      {
        SHOPWARE_ENDPOINT: "http://shopware.internal/store-api/",
        SHOPWARE_PUBLIC_ENDPOINT: "https://shop.example.com/store-api/",
        SHOPWARE_DEV_STOREFRONT_URL: "https://shop.example.com/en",
      },
    ],
  ])("stays quiet for %s", async (_, env: Record<string, string>) => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    stubShopwareEnv(env);
    const { getShopwareConfig: readConfig } = await freshConfigModule();

    readConfig();

    expect(warn).not.toHaveBeenCalled();
  });
});
