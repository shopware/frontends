import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { resourceHintOrigins } from "./resourceHintOrigins";

vi.mock("server-only", () => ({}));

const ENV = [
  "SHOPWARE_ENDPOINT",
  "SHOPWARE_PUBLIC_ENDPOINT",
  "SHOPWARE_ACCESS_TOKEN",
  "SHOPWARE_DEV_STOREFRONT_URL",
  "SHOPWARE_MEDIA_ORIGIN",
  "STOREFRONT_URL",
];

function stubEnv(env: Record<string, string>) {
  for (const name of ENV) vi.stubEnv(name, env[name] ?? "");
}

async function freshOrigins() {
  vi.resetModules();
  const fresh = await import("./resourceHintOrigins");
  return fresh.resourceHintOrigins;
}

beforeEach(() => {
  stubEnv({});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("resourceHintOrigins", () => {
  it("points at the demo media CDN and the demo Store API without configuration", () => {
    expect(resourceHintOrigins()).toEqual({
      media: "https://cdn.shopware.store",
      storeApi: "https://demo-frontends.shopware.store",
    });
  });

  it("uses the public Store API origin, not the internal one, for media and the API", () => {
    stubEnv({
      SHOPWARE_ENDPOINT: "http://shopware.internal/store-api/",
      SHOPWARE_PUBLIC_ENDPOINT: "https://api.example.com/store-api/",
    });

    expect(resourceHintOrigins()).toEqual({
      media: "https://api.example.com",
      storeApi: "https://api.example.com",
    });
  });

  it("takes only the origin of SHOPWARE_MEDIA_ORIGIN", () => {
    stubEnv({
      SHOPWARE_ENDPOINT: "https://api.example.com/store-api/",
      SHOPWARE_MEDIA_ORIGIN: "https://cdn.example.com/media/",
    });

    expect(resourceHintOrigins()).toEqual({
      media: "https://cdn.example.com",
      storeApi: "https://api.example.com",
    });
  });

  it.each(["cdn.example.com", "ftp://cdn.example.com"])(
    "ignores the unusable SHOPWARE_MEDIA_ORIGIN %j with one warning that never prints it",
    async (value) => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      stubEnv({
        SHOPWARE_ENDPOINT: "https://api.example.com/store-api/",
        SHOPWARE_MEDIA_ORIGIN: value,
      });
      const origins = await freshOrigins();

      expect(origins().media).toBe("https://api.example.com");
      expect(origins().media).toBe("https://api.example.com");

      expect(warn).toHaveBeenCalledExactlyOnceWith(
        "[Shopware] SHOPWARE_MEDIA_ORIGIN is not an http(s) URL, so it is ignored",
      );
      expect(JSON.stringify(warn.mock.calls)).not.toContain(value);
    },
  );

  it("skips an origin that is the storefront's own", () => {
    stubEnv({
      SHOPWARE_ENDPOINT: "https://shop.example.com/store-api/",
      SHOPWARE_MEDIA_ORIGIN: "https://cdn.example.com",
      STOREFRONT_URL: "https://shop.example.com/",
    });

    expect(resourceHintOrigins()).toEqual({
      media: "https://cdn.example.com",
      storeApi: null,
    });

    stubEnv({
      SHOPWARE_ENDPOINT: "https://shop.example.com/store-api/",
      STOREFRONT_URL: "https://shop.example.com",
    });

    expect(resourceHintOrigins()).toEqual({ media: null, storeApi: null });
  });

  it("gives no Store API hint for a public endpoint that is not a URL", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    stubEnv({
      SHOPWARE_ENDPOINT: "https://api.example.com/store-api/",
      SHOPWARE_PUBLIC_ENDPOINT: "/store-api/",
    });

    expect(resourceHintOrigins()).toEqual({ media: null, storeApi: null });
  });
});
