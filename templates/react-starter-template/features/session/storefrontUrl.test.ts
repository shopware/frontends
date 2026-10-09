import { describe, expect, it } from "vitest";

import { getStorefrontUrl } from "./storefrontUrl";
import type { StorefrontUrlContext } from "./storefrontUrl";

const ORIGIN = "http://localhost:3000";
const ENGLISH = "language-en";
const GERMAN = "language-de";

const domains = [
  { url: "https://shop.test/de", languageId: GERMAN },
  { url: "https://shop.test/en/", languageId: ENGLISH },
];

function context(
  overrides: Partial<StorefrontUrlContext> = {},
): StorefrontUrlContext {
  return {
    salesChannel: { languageId: GERMAN, domains },
    context: { languageIdChain: [ENGLISH, GERMAN] },
    ...overrides,
  };
}

describe("getStorefrontUrl", () => {
  it("returns the dev storefront URL when there is no context yet", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: "https://shop.test/figma",
        origin: ORIGIN,
        context: null,
      }),
    ).toBe("https://shop.test/figma");
  });

  it("returns the page origin without a dev storefront URL or domains", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: context({ salesChannel: { languageId: GERMAN, domains: [] } }),
      }),
    ).toBe(ORIGIN);
  });

  it("returns the sales channel domain that matches the preferred URL, ignoring a trailing slash", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: "https://shop.test/en",
        origin: ORIGIN,
        context: context({ context: { languageIdChain: [GERMAN] } }),
      }),
    ).toBe("https://shop.test/en/");
  });

  it("matches the page origin when no dev storefront URL is set", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: null,
        origin: "https://shop.test/de/",
        context: context(),
      }),
    ).toBe("https://shop.test/de");
  });

  it("falls back to the domain of the first language in the chain", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: context(),
      }),
    ).toBe("https://shop.test/en/");
  });

  it("uses the sales channel language when the chain is empty", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: context({ context: { languageIdChain: [] } }),
      }),
    ).toBe("https://shop.test/de");
  });

  it("falls back to the first domain with a URL", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: {
          salesChannel: {
            languageId: "language-fr",
            domains: [{ url: "", languageId: "language-fr" }, ...domains],
          },
          context: { languageIdChain: ["language-fr"] },
        },
      }),
    ).toBe("https://shop.test/de");
  });

  it("returns the preferred URL when no domain has a URL", () => {
    expect(
      getStorefrontUrl({
        devStorefrontUrl: null,
        origin: ORIGIN,
        context: {
          salesChannel: {
            languageId: GERMAN,
            domains: [{ url: "", languageId: GERMAN }],
          },
        },
      }),
    ).toBe(ORIGIN);
  });
});
