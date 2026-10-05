import { describe, expect, it } from "vitest";

import { parsePublicShopwareConfig } from "./publicConfig";

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

  it.each([
    ["no object", null],
    ["a string", "config"],
    ["no endpoint", { ...config, endpoint: undefined }],
    ["an empty access token", { ...config, accessToken: "" }],
    ["a numeric dev storefront URL", { ...config, devStorefrontUrl: 1 }],
    ["no dev storefront URL key", { endpoint: "e", accessToken: "t" }],
  ])("throws on %s", (_, value) => {
    expect(() => parsePublicShopwareConfig(value)).toThrow();
  });
});
