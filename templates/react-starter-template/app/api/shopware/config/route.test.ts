import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const server = vi.hoisted(() => ({ connection: vi.fn(async () => {}) }));

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: server.connection }));

beforeEach(() => {
  server.connection.mockClear();
  vi.stubEnv("SHOPWARE_ENDPOINT", "http://shopware.internal/store-api/");
  vi.stubEnv("SHOPWARE_PUBLIC_ENDPOINT", "https://shop.example.com/store-api/");
  vi.stubEnv("SHOPWARE_ACCESS_TOKEN", "SWSCOWN");
  vi.stubEnv("SHOPWARE_DEV_STOREFRONT_URL", "https://shop.example.com/en");
  vi.stubEnv("SHOPWARE_API_HEADERS", "");
  vi.stubEnv("SHOPWARE_PUBLIC_API_HEADERS", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("GET /api/shopware/config", () => {
  it("returns only the public endpoint, the access token, the dev storefront URL and the public headers", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      endpoint: "https://shop.example.com/store-api/",
      accessToken: "SWSCOWN",
      devStorefrontUrl: "https://shop.example.com/en",
      headers: {},
    });
  });

  it("sends SHOPWARE_PUBLIC_API_HEADERS with lowercased names", async () => {
    vi.stubEnv(
      "SHOPWARE_PUBLIC_API_HEADERS",
      '{"X-Edge-Region":"eu","Authorization":"Basic cHVibGlj"}',
    );

    const response = await GET();

    expect((await response.json()).headers).toEqual({
      "x-edge-region": "eu",
      authorization: "Basic cHVibGlj",
    });
  });

  it("never sends SHOPWARE_API_HEADERS to the browser", async () => {
    vi.stubEnv("SHOPWARE_API_HEADERS", '{"authorization":"Basic c2VjcmV0"}');
    vi.stubEnv("SHOPWARE_PUBLIC_API_HEADERS", '{"x-edge-region":"eu"}');

    const response = await GET();
    const body = await response.text();

    expect(body).not.toContain("c2VjcmV0");
    expect(JSON.parse(body).headers).toEqual({ "x-edge-region": "eu" });
  });

  it("leaves out public headers the Store API client or the browser must not get", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv(
      "SHOPWARE_PUBLIC_API_HEADERS",
      '{"sw-context-token":"shared","cookie":"a=b","host":"shop.test","x-edge-region":"eu"}',
    );

    const response = await GET();

    expect((await response.json()).headers).toEqual({
      "x-edge-region": "eu",
    });
  });

  it("is never cached", async () => {
    const response = await GET();

    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("Content-Type")).toContain("application/json");
  });

  it("opts out of prerendering before it reads the environment", async () => {
    let endpointAtConnection: string | undefined;
    server.connection.mockImplementationOnce(async () => {
      endpointAtConnection = process.env.SHOPWARE_PUBLIC_ENDPOINT;
      vi.stubEnv(
        "SHOPWARE_PUBLIC_ENDPOINT",
        "https://runtime.example.com/store-api/",
      );
    });

    const response = await GET();

    expect(server.connection).toHaveBeenCalledTimes(1);
    expect(endpointAtConnection).toBe("https://shop.example.com/store-api/");
    expect(await response.json()).toMatchObject({
      endpoint: "https://runtime.example.com/store-api/",
    });
  });

  it("falls back to the demo backend without any configuration", async () => {
    vi.stubEnv("SHOPWARE_ENDPOINT", "");
    vi.stubEnv("SHOPWARE_PUBLIC_ENDPOINT", "");
    vi.stubEnv("SHOPWARE_ACCESS_TOKEN", "");
    vi.stubEnv("SHOPWARE_DEV_STOREFRONT_URL", "");

    const response = await GET();

    expect(await response.json()).toEqual({
      endpoint: "https://demo-frontends.shopware.store/store-api/",
      accessToken: "SWSCNWDGMUWZM0TLVUU0YKLQVW",
      devStorefrontUrl: "https://demo-frontends.shopware.store/figma",
      headers: {},
    });
  });
});
