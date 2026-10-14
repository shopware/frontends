import { beforeEach, describe, expect, it, vi } from "vitest";

import { readCanonicalSeoPath } from "@/platform/shopware/reads/canonicalSeoPath";
import { readLanguages } from "@/platform/shopware/reads/languages";

import { buildLanguageAlternates } from "./alternates";
import type { LanguageAlternatesInput } from "./alternates";

vi.mock("server-only", () => ({}));
vi.mock("@/platform/shopware/reads/languages", () => ({
  readLanguages: vi.fn(),
}));
vi.mock("@/platform/shopware/reads/canonicalSeoPath", () => ({
  readCanonicalSeoPath: vi.fn(),
}));

const SITE = new URL("https://shop.test");

const EN_DE_PL = [
  { id: "language-en", code: "en-GB" },
  { id: "language-pl", code: "pl-PL" },
  { id: "language-de", code: "de-DE" },
];

const SEO_PATHS: Record<string, string> = {
  "language-en": "Clothing/",
  "language-pl": "Odziez/",
  "language-de": "Bekleidung/",
};

function category(
  overrides: Partial<LanguageAlternatesInput> = {},
): LanguageAlternatesInput {
  return {
    target: {
      kind: "route",
      routeName: "frontend.navigation.page",
      foreignKey: "c1",
    },
    locale: "de-DE",
    seoPath: "/Bekleidung/",
    query: "",
    siteUrl: SITE,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readLanguages).mockResolvedValue(EN_DE_PL);
  vi.mocked(readCanonicalSeoPath).mockImplementation(
    async (_routeName, _foreignKey, languageId) =>
      SEO_PATHS[languageId] ?? null,
  );
});

describe("buildLanguageAlternates", () => {
  it("links the entity's SEO URL of every other locale, read in its language", async () => {
    await expect(
      buildLanguageAlternates(category({ query: "?p=2" })),
    ).resolves.toEqual({
      "en-GB": "https://shop.test/Clothing/?p=2",
      "pl-PL": "https://shop.test/pl-PL/Odziez/?p=2",
      "de-DE": "https://shop.test/de-DE/Bekleidung/?p=2",
      "x-default": "https://shop.test/Clothing/?p=2",
    });
    expect(vi.mocked(readCanonicalSeoPath).mock.calls).toEqual([
      ["frontend.navigation.page", "c1", "language-en"],
      ["frontend.navigation.page", "c1", "language-pl"],
    ]);
  });

  it("links every locale's home page without a read", async () => {
    await expect(
      buildLanguageAlternates(
        category({ target: { kind: "home" }, locale: "pl-PL", seoPath: "/" }),
      ),
    ).resolves.toEqual({
      "en-GB": "https://shop.test/",
      "pl-PL": "https://shop.test/pl-PL",
      "de-DE": "https://shop.test/de-DE",
      "x-default": "https://shop.test/",
    });
    expect(readCanonicalSeoPath).not.toHaveBeenCalled();
  });

  it.each([
    ["without a site URL", { siteUrl: null }],
    ["for a page without an SEO URL", { seoPath: null }],
  ])("reads nothing %s", async (_, overrides) => {
    await expect(
      buildLanguageAlternates(category(overrides)),
    ).resolves.toBeUndefined();
    expect(readLanguages).not.toHaveBeenCalled();
    expect(readCanonicalSeoPath).not.toHaveBeenCalled();
  });

  it("reads no SEO URL for a locale without a language of its own", async () => {
    vi.mocked(readLanguages).mockResolvedValue([
      { id: "language-en", code: "en-GB" },
      { id: "language-de", code: "de-DE" },
    ]);

    await expect(
      buildLanguageAlternates(category({ locale: "pl-PL" })),
    ).resolves.toBeUndefined();
    expect(readCanonicalSeoPath).not.toHaveBeenCalled();
  });

  it("reads no SEO URL on a shop with fewer than two such locales", async () => {
    vi.mocked(readLanguages).mockResolvedValue([
      { id: "language-us", code: "en-US" },
      { id: "language-de", code: "de-DE" },
    ]);

    await expect(buildLanguageAlternates(category())).resolves.toBeUndefined();
    expect(readCanonicalSeoPath).not.toHaveBeenCalled();
  });

  it("leaves out a locale whose read failed or that has no SEO URL", async () => {
    vi.mocked(readCanonicalSeoPath).mockImplementation(
      async (_routeName, _foreignKey, languageId) => {
        if (languageId === "language-pl") throw new Error("offline");
        return SEO_PATHS[languageId] ?? null;
      },
    );

    await expect(buildLanguageAlternates(category())).resolves.toEqual({
      "en-GB": "https://shop.test/Clothing/",
      "de-DE": "https://shop.test/de-DE/Bekleidung/",
      "x-default": "https://shop.test/Clothing/",
    });
  });

  it("has nothing when only the page's own locale is left", async () => {
    vi.mocked(readCanonicalSeoPath).mockResolvedValue(null);

    await expect(buildLanguageAlternates(category())).resolves.toBeUndefined();
  });

  it("has nothing when the languages cannot be read", async () => {
    vi.mocked(readLanguages).mockRejectedValue(new Error("offline"));

    await expect(buildLanguageAlternates(category())).resolves.toBeUndefined();
    expect(readCanonicalSeoPath).not.toHaveBeenCalled();
  });
});
