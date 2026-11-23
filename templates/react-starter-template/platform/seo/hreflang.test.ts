import { describe, expect, it } from "vitest";

import { hreflangLocales, languageAlternates } from "./hreflang";

const SITE = new URL("https://shop.test");

describe("hreflangLocales", () => {
  it("has no participant on the demo, whose only language is English (US)", () => {
    expect(hreflangLocales([{ id: "language-us", code: "en-US" }])).toEqual([]);
  });

  it("lists the locales with a language of their own in locale order", () => {
    expect(
      hreflangLocales([
        { id: "language-de", code: "de-DE" },
        { id: "language-us", code: "en-US" },
        { id: "language-en", code: "en-GB" },
      ]),
    ).toEqual([
      { locale: "en-GB", languageId: "language-en" },
      { locale: "de-DE", languageId: "language-de" },
    ]);
  });

  it("has no participant when only one locale has a language of its own", () => {
    expect(
      hreflangLocales([
        { id: "language-de", code: "de-DE" },
        { id: "language-us", code: null },
      ]),
    ).toEqual([]);
  });
});

describe("languageAlternates", () => {
  it("builds absolute prefixed URLs with the listing page and the default locale as x-default", () => {
    expect(
      languageAlternates(
        {
          "en-GB": "/Clothing/?p=3",
          "de-DE": "/Bekleidung/?p=3",
          "pl-PL": "/Odzież/?p=3",
        },
        SITE,
      ),
    ).toEqual({
      "en-GB": "https://shop.test/Clothing/?p=3",
      "pl-PL": "https://shop.test/pl-PL/Odzie%C5%BC/?p=3",
      "de-DE": "https://shop.test/de-DE/Bekleidung/?p=3",
      "x-default": "https://shop.test/Clothing/?p=3",
    });
  });

  it("prefixes the home page of every locale", () => {
    expect(languageAlternates({ "en-GB": "/", "de-DE": "/" }, SITE)).toEqual({
      "en-GB": "https://shop.test/",
      "de-DE": "https://shop.test/de-DE",
      "x-default": "https://shop.test/",
    });
  });

  it("has no x-default without the default locale", () => {
    expect(
      languageAlternates({ "pl-PL": "/Meble/", "de-DE": "/Moebel/" }, SITE),
    ).toEqual({
      "pl-PL": "https://shop.test/pl-PL/Meble/",
      "de-DE": "https://shop.test/de-DE/Moebel/",
    });
  });

  it("has nothing for fewer than two locales", () => {
    expect(languageAlternates({ "de-DE": "/Moebel/" }, SITE)).toBeUndefined();
    expect(languageAlternates({}, SITE)).toBeUndefined();
  });
});
