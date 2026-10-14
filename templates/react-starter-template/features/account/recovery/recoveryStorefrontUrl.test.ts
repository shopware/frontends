import { describe, expect, it } from "vitest";

import { contextWithDomains } from "./recovery.fixture";
import { recoveryStorefrontUrl } from "./recoveryStorefrontUrl";

const ORIGIN = "https://shop.test";

const DOMAINS = [
  { url: "https://shop.test", languageId: "language-en" },
  { url: "https://shop.test/pl-PL", languageId: "language-pl" },
  { url: "https://shop.test/de-DE/", languageId: "language-de" },
];

describe("recoveryStorefrontUrl", () => {
  it("prefers the domain of the locale prefix", () => {
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: contextWithDomains(DOMAINS),
        localePrefix: "pl-PL",
      }),
    ).toBe("https://shop.test/pl-PL");
  });

  it("trims the trailing slash of the prefixed domain", () => {
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: contextWithDomains(DOMAINS),
        localePrefix: "de-DE",
      }),
    ).toBe("https://shop.test/de-DE");
  });

  it("keeps the root domain for the default locale", () => {
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: contextWithDomains(DOMAINS, "language-de"),
        localePrefix: "",
      }),
    ).toBe("https://shop.test");
  });

  it("adds the prefix to the dev storefront URL", () => {
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: "https://staging.test/",
        origin: "http://localhost:3000",
        context: contextWithDomains([
          { url: "https://staging.test", languageId: "language-en" },
          { url: "https://staging.test/de-DE", languageId: "language-de" },
        ]),
        localePrefix: "de-DE",
      }),
    ).toBe("https://staging.test/de-DE");
  });

  it("falls back to the storefront URL rules without a prefixed domain", () => {
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: contextWithDomains([
          { url: "https://shop.test/", languageId: "language-en" },
          { url: "https://other.test/de", languageId: "language-de" },
        ]),
        localePrefix: "de-DE",
      }),
    ).toBe("https://shop.test");
  });

  it("uses the language domain when the origin matches none", () => {
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: null,
        origin: "http://localhost:3000",
        context: contextWithDomains(
          [
            { url: "https://shop.test/en/", languageId: "language-en" },
            { url: "https://shop.test/de/", languageId: "language-de" },
          ],
          "language-de",
        ),
        localePrefix: "de-DE",
      }),
    ).toBe("https://shop.test/de");
  });

  it("returns the trimmed origin without domains", () => {
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: null,
        origin: "https://shop.test/",
        context: contextWithDomains([]),
        localePrefix: "pl-PL",
      }),
    ).toBe("https://shop.test");
    expect(
      recoveryStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: null,
        localePrefix: "",
      }),
    ).toBe("https://shop.test");
  });
});
