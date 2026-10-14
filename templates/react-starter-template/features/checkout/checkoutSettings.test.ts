import { describe, expect, it } from "vitest";

import { shopSettings } from "@/platform/shopware/shopSettings.fixture";

import { toCheckoutSettings, toLegalLinkHref } from "./checkoutSettings";

describe("toCheckoutSettings", () => {
  it("keeps only the settings the checkout uses", () => {
    expect(
      toCheckoutSettings(
        shopSettings({
          loginRegistration: {
            requireDataProtectionCheckbox: true,
            passwordMinLength: 10,
            showSalutation: true,
          },
          cart: { showCustomerComment: true, enableOrderRefunds: true },
        }),
        { terms: "/navigation/terms", revocation: "https://shop.test/cancel" },
      ),
    ).toEqual({
      showCustomerComment: true,
      requireDataProtectionCheckbox: true,
      passwordMinLength: 10,
      legalLinks: {
        terms: "/navigation/terms",
        revocation: "https://shop.test/cancel",
      },
    });
  });

  it("drops a legal link it cannot use", () => {
    expect(
      toCheckoutSettings(shopSettings(), {
        terms: "javascript:alert(1)",
        revocation: "//evil.example/cancel",
      }).legalLinks,
    ).toEqual({ terms: null, revocation: null });
  });
});

describe("toLegalLinkHref", () => {
  it("accepts a storefront path and trims it", () => {
    expect(toLegalLinkHref("/navigation/0190abc")).toBe("/navigation/0190abc");
    expect(toLegalLinkHref("  /agb  ")).toBe("/agb");
  });

  it("accepts an absolute http or https URL", () => {
    expect(toLegalLinkHref("https://shop.example/agb")).toBe(
      "https://shop.example/agb",
    );
    expect(toLegalLinkHref("http://shop.example/agb")).toBe(
      "http://shop.example/agb",
    );
  });

  it.each([
    ["no link", null],
    ["an empty value", "  "],
    ["a protocol-relative URL", "//evil.example"],
    ["a script URL", "javascript:alert(1)"],
    ["another protocol", "ftp://shop.example/agb"],
    ["a relative path", "relative/path"],
    ["a backslash", "/\\evil.example"],
    ["a control character", "/agb\u0000"],
  ])("rejects %s", (_, value) => {
    expect(toLegalLinkHref(value)).toBeNull();
  });
});
