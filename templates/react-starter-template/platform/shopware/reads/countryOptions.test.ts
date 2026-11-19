import { describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import {
  collectCountryPages,
  countryPageCriteria,
  toCountryOptions,
} from "./countryOptions";
import type { CountryPage } from "./countryOptions";

function country(overrides: Record<string, unknown>): Schemas["Country"] {
  return {
    id: "country",
    name: "Fallback",
    translated: {},
    ...overrides,
  } as unknown as Schemas["Country"];
}

describe("toCountryOptions", () => {
  it("prefers the translated name and iso and uppercases the iso", () => {
    expect(
      toCountryOptions([
        country({
          id: "de",
          name: "Germany",
          iso: "de",
          translated: { name: "Deutschland", iso: "dE" },
        }),
      ]),
    ).toEqual([{ id: "de", name: "Deutschland", iso: "DE", states: [] }]);
  });

  it("falls back to the untranslated name and iso", () => {
    expect(
      toCountryOptions([
        country({ id: "fr", name: "France", iso: "fr", translated: {} }),
        country({ id: "fallback", name: "Nowhere" }),
      ]),
    ).toEqual([
      { id: "fr", name: "France", iso: "FR", states: [] },
      { id: "fallback", name: "Nowhere", iso: "", states: [] },
    ]);
  });

  it("maps the states in the order received with translated names", () => {
    const [option] = toCountryOptions([
      country({
        id: "us",
        name: "USA",
        iso: "US",
        states: [
          { id: "ny", name: "New York", translated: { name: "New York" } },
          { id: "ca", name: "California", translated: {} },
          { id: "tx", name: "Texas", translated: { name: "Tejas" } },
        ],
      }),
    ]);

    expect(option?.states).toEqual([
      { id: "ny", name: "New York" },
      { id: "ca", name: "California" },
      { id: "tx", name: "Tejas" },
    ]);
  });

  it("returns an empty list for an empty input", () => {
    expect(toCountryOptions([])).toEqual([]);
  });
});

describe("countryPageCriteria", () => {
  it("asks for one page of 100 countries in a total order with their states sorted by position", () => {
    expect(countryPageCriteria(3)).toEqual({
      limit: 100,
      page: 3,
      sort: [
        { field: "position", order: "ASC" },
        { field: "name", order: "ASC" },
        { field: "id", order: "ASC" },
      ],
      associations: {
        states: { sort: [{ field: "position", order: "ASC" }] },
      },
      "total-count-mode": "exact",
    });
  });
});

function countryPage(page: number, size: number): Schemas["Country"][] {
  return Array.from({ length: size }, (_, index) =>
    country({
      id: `country-${page}-${index}`,
      name: `Country ${page}-${index}`,
    }),
  );
}

function pageFetcher(pages: CountryPage[]) {
  return vi.fn(async (page: number) => pages[page - 1] ?? { elements: [] });
}

describe("collectCountryPages", () => {
  it("reads every page until the total is reached and keeps the order", async () => {
    const pages = [
      { elements: countryPage(1, 100), total: 250 },
      { elements: countryPage(2, 100), total: 250 },
      { elements: countryPage(3, 50), total: 250 },
    ];
    const fetchPage = pageFetcher(pages);

    const result = await collectCountryPages(fetchPage);

    expect(fetchPage.mock.calls.map(([page]) => page)).toEqual([1, 2, 3]);
    expect(result).toHaveLength(250);
    expect(result).toEqual(pages.flatMap((page) => page.elements));
  });

  it("stops at an empty page even when the total says more remain", async () => {
    const fetchPage = pageFetcher([
      { elements: countryPage(1, 100), total: 250 },
      { elements: [], total: 250 },
      { elements: countryPage(3, 50), total: 250 },
    ]);

    const result = await collectCountryPages(fetchPage);

    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(100);
  });

  it("stops after one page when the response carries no total", async () => {
    const fetchPage = pageFetcher([
      { elements: countryPage(1, 100) },
      { elements: countryPage(2, 100) },
    ]);

    const result = await collectCountryPages(fetchPage);

    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(100);
  });

  it("keeps the first occurrence when pages overlap", async () => {
    const first = countryPage(1, 3);
    const overlapping = [
      country({ id: "country-1-2", name: "Repeated" }),
      ...countryPage(2, 2),
    ];
    const fetchPage = pageFetcher([
      { elements: first, total: 6 },
      { elements: overlapping, total: 6 },
    ]);

    const result = await collectCountryPages(fetchPage);

    expect(fetchPage).toHaveBeenCalledTimes(2);
    expect(result.map(({ id }) => id)).toEqual([
      "country-1-0",
      "country-1-1",
      "country-1-2",
      "country-2-0",
      "country-2-1",
    ]);
    expect(result[2]?.name).toBe("Country 1-2");
  });

  it("gives up after ten pages", async () => {
    const fetchPage = vi.fn(async (page: number) => ({
      elements: countryPage(page, 100),
      total: 100_000,
    }));

    const result = await collectCountryPages(fetchPage);

    expect(fetchPage).toHaveBeenCalledTimes(10);
    expect(result).toHaveLength(1000);
  });
});
