import { describe, expect, it } from "vitest";

import {
  isBrowserForbiddenHeader,
  isReservedApiHeader,
  isValidHeaderName,
  isValidHeaderValue,
  parsePublicShopwareConfig,
} from "./publicConfig";

const config = {
  endpoint: "https://shop.example.com/store-api/",
  accessToken: "SWSCOWN",
  devStorefrontUrl: "https://shop.example.com/en",
};

describe("parsePublicShopwareConfig", () => {
  it("returns a well-formed payload", () => {
    expect(parsePublicShopwareConfig(config)).toEqual(config);
  });

  it("accepts a missing dev storefront URL as null", () => {
    expect(
      parsePublicShopwareConfig({ ...config, devStorefrontUrl: null }),
    ).toEqual({ ...config, devStorefrontUrl: null });
  });

  it("drops keys the browser does not need", () => {
    expect(
      parsePublicShopwareConfig({ ...config, endpointInternal: "x" }),
    ).toEqual(config);
  });

  it("keeps the public headers", () => {
    const headers = { "x-edge-region": "eu", authorization: "Basic cHVibGlj" };

    expect(parsePublicShopwareConfig({ ...config, headers })).toEqual({
      ...config,
      headers,
    });
  });

  it("lowercases header names and drops what the client owns or the browser refuses", () => {
    expect(
      parsePublicShopwareConfig({
        ...config,
        headers: {
          "X-Edge-Region": "eu",
          "sw-context-token": "shared",
          "SW-Access-Key": "SWSCOTHER",
          accept: "text/html",
          host: "shop.test",
          cookie: "a=b",
          "sec-fetch-site": "none",
          "bad name": "x",
          "x-line-break": "a\r\nb",
          "x-empty": "",
        },
      }).headers,
    ).toEqual({ "x-edge-region": "eu" });
  });

  it.each([
    ["no object", null],
    ["a string", "config"],
    ["no endpoint", { ...config, endpoint: undefined }],
    ["an empty access token", { ...config, accessToken: "" }],
    ["a numeric dev storefront URL", { ...config, devStorefrontUrl: 1 }],
    ["no dev storefront URL key", { endpoint: "e", accessToken: "t" }],
    ["a non-string header value", { ...config, headers: { "x-edge": 1 } }],
    ["headers that are no object", { ...config, headers: ["x-edge"] }],
  ])("throws on %s", (_, value) => {
    expect(() => parsePublicShopwareConfig(value)).toThrow();
  });
});

describe("isReservedApiHeader", () => {
  it.each([
    "sw-access-key",
    "SW-Context-Token",
    "sw-language-id",
    "sw-currency-id",
    "sw_access_key",
    "SW_Context_Token",
    "Content_Type",
    "Accept",
    "content-type",
    "content-length",
    "host",
    "connection",
    "keep-alive",
    "transfer-encoding",
    "upgrade",
    "expect",
    "te",
    "trailer",
  ])("reserves %s", (name) => {
    expect(isReservedApiHeader(name)).toBe(true);
  });

  it.each([
    "authorization",
    "x-sw-edge",
    "x_sw_edge",
    "x-waf-bypass",
    "cookie",
  ])("allows %s", (name) => {
    expect(isReservedApiHeader(name)).toBe(false);
  });
});

describe("isBrowserForbiddenHeader", () => {
  it.each([
    "cookie",
    "Origin",
    "referer",
    "proxy-authorization",
    "Sec-Fetch-Mode",
    "accept-encoding",
    "via",
  ])("forbids %s", (name) => {
    expect(isBrowserForbiddenHeader(name)).toBe(true);
  });

  it.each(["authorization", "x-edge-region", "x-secure"])(
    "allows %s",
    (name) => {
      expect(isBrowserForbiddenHeader(name)).toBe(false);
    },
  );
});

describe("isValidHeaderName", () => {
  it.each(["x-edge-region", "X-Edge-Region", "authorization", "x_custom.1"])(
    "accepts %j",
    (name) => {
      expect(isValidHeaderName(name)).toBe(true);
    },
  );

  it.each(["", "bad name", "x:colon", "x-\u00fcml", "x-edge\n"])(
    "rejects %j",
    (name) => {
      expect(isValidHeaderName(name)).toBe(false);
    },
  );
});

describe("isValidHeaderValue", () => {
  it.each(["Basic c2VjcmV0", "caf\u00e9", "a\tb"])("accepts %j", (value) => {
    expect(isValidHeaderValue(value)).toBe(true);
  });

  it.each(["", "  ", "a\r\nb", "a\u0000", "a\u0007", "\u20ac"])(
    "rejects %j",
    (value) => {
      expect(isValidHeaderValue(value)).toBe(false);
    },
  );
});
