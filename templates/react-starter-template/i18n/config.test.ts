import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  isLocale,
  localePrefix,
  locales,
  stripLocale,
  withLocale,
} from "./config";

describe("locales", () => {
  it("lists the Vue starter locales with en-GB as the default", () => {
    expect(locales).toEqual(["en-GB", "pl-PL", "de-DE"]);
    expect(defaultLocale).toBe("en-GB");
  });

  it.each([
    ["en-GB", true],
    ["pl-PL", true],
    ["de-DE", true],
    ["pl-pl", false],
    ["en", false],
    ["", false],
    ["constructor", false],
  ])("isLocale(%j) is %s", (value, expected) => {
    expect(isLocale(value)).toBe(expected);
  });

  it("gives the default locale no URL prefix", () => {
    expect(localePrefix("en-GB")).toBe("");
    expect(localePrefix("pl-PL")).toBe("pl-PL");
    expect(localePrefix("de-DE")).toBe("de-DE");
  });
});

describe("withLocale", () => {
  it.each([
    ["/", "/pl-PL"],
    ["/account", "/pl-PL/account"],
    ["/Clothing/", "/pl-PL/Clothing/"],
    [
      "/account/login?redirect=%2Fcheckout",
      "/pl-PL/account/login?redirect=%2Fcheckout",
    ],
    ["/?p=2", "/pl-PL?p=2"],
    ["/#top", "/pl-PL#top"],
    ["/checkout#summary", "/pl-PL/checkout#summary"],
  ])("prefixes the internal path %s", (path, expected) => {
    expect(withLocale(path, "pl-PL")).toBe(expected);
  });

  it("uses the prefix of the given locale", () => {
    expect(withLocale("/account", "de-DE")).toBe("/de-DE/account");
  });

  it.each(["/", "/account", "/account?x=1"])(
    "leaves %s unchanged for the default locale",
    (path) => {
      expect(withLocale(path, "en-GB")).toBe(path);
    },
  );

  it.each([
    "https://shop.test/account",
    "http://shop.test/",
    "//cdn.shop.test/logo.svg",
    "mailto:jane@example.com",
    "tel:+4930123",
    "#main",
    "?p=2",
    "account",
    "",
  ])("leaves %j unchanged", (path) => {
    expect(withLocale(path, "pl-PL")).toBe(path);
  });

  it.each([
    "/pl-PL",
    "/pl-PL/account",
    "/de-DE/account",
    "/en-GB/account",
    "/pl-PL?p=2",
    "/de-DE#top",
  ])("leaves the already prefixed path %s unchanged", (path) => {
    expect(withLocale(path, "pl-PL")).toBe(path);
  });

  it("prefixes a path whose first segment only starts like a locale", () => {
    expect(withLocale("/pl-PLX/account", "pl-PL")).toBe(
      "/pl-PL/pl-PLX/account",
    );
    expect(withLocale("/pl-pl/account", "pl-PL")).toBe("/pl-PL/pl-pl/account");
  });
});

describe("stripLocale", () => {
  it.each([
    ["/pl-PL/account", "pl-PL", "/account"],
    ["/pl-PL", "pl-PL", "/"],
    ["/pl-PL/", "pl-PL", "/"],
    ["/de-DE/Clothing/", "de-DE", "/Clothing/"],
    ["/en-GB/checkout", "en-GB", "/checkout"],
  ])("splits %s into %s and %s", (pathname, locale, rest) => {
    expect(stripLocale(pathname)).toEqual({ locale, pathname: rest });
  });

  it.each(["/", "/account", "/pl-pl/account", "/pl-PLX", "/Clothing/", ""])(
    "keeps %j under the default locale",
    (pathname) => {
      expect(stripLocale(pathname)).toEqual({ locale: "en-GB", pathname });
    },
  );

  it("round-trips with withLocale", () => {
    for (const locale of locales) {
      for (const path of ["/", "/account", "/Clothing/"]) {
        expect(stripLocale(withLocale(path, locale))).toEqual({
          locale,
          pathname: path,
        });
      }
    }
  });
});
