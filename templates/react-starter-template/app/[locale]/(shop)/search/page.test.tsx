import type { ListingSearchParams } from "@shopware/cms-base-layer-react";
import { describe, expect, it, vi } from "vitest";

import { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("@/features/search/components/SearchResults", () => ({
  SearchResults: () => null,
}));

vi.mock("@/platform/shopware/reads/languages", () => ({
  resolveLanguageId: vi.fn(),
}));

function props(locale: string, query: ListingSearchParams) {
  return {
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve(query),
  };
}

describe("SearchPage generateMetadata", () => {
  it.each([
    ["en-GB", 'Search results for "linen shirt"'],
    ["pl-PL", "Wyniki wyszukiwania dla „linen shirt”"],
    ["de-DE", "Suchergebnisse für „linen shirt“"],
  ])("titles the %s page with the normalized term", async (locale, title) => {
    await expect(
      generateMetadata(props(locale, { search: "  linen   shirt " })),
    ).resolves.toEqual({ title, robots: { index: false, follow: true } });
  });

  it.each([{}, { search: "  " }])(
    "titles the page without a term as the search for %j",
    async (query) => {
      await expect(generateMetadata(props("pl-PL", query))).resolves.toEqual({
        title: "Wyszukiwanie",
        robots: { index: false, follow: true },
      });
    },
  );

  it("keeps markup characters of the term as text", async () => {
    const metadata = await generateMetadata(
      props("en-GB", { search: "<b>{term}</b>" }),
    );

    expect(metadata.title).toBe('Search results for "<b>{term}</b>"');
  });
});
