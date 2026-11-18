import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

export type CountryOption = {
  id: string;
  name: string;
  iso: string;
  states: { id: string; name: string }[];
};

export function toCountryOptions(
  countries: Schemas["Country"][],
): CountryOption[] {
  return countries.map((country) => ({
    id: country.id,
    name: getTranslatedProperty(country, "name"),
    iso: (country.translated?.iso || country.iso || "").toUpperCase(),
    states: (country.states ?? []).map((state) => ({
      id: state.id,
      name: getTranslatedProperty(state, "name"),
    })),
  }));
}

export function countryPageCriteria(page: number): Schemas["Criteria"] {
  return {
    limit: 100,
    page,
    sort: [
      { field: "position", order: "ASC" },
      { field: "name", order: "ASC" },
      { field: "id", order: "ASC" },
    ],
    associations: {
      states: { sort: [{ field: "position", order: "ASC" }] },
    },
    "total-count-mode": "exact",
  };
}

export type CountryPage = {
  elements?: Schemas["Country"][] | null;
  total?: number | null;
};

export async function collectCountryPages(
  fetchPage: (page: number) => Promise<CountryPage>,
  maxPages = 10,
): Promise<Schemas["Country"][]> {
  const countries = new Map<string, Schemas["Country"]>();
  let fetched = 0;
  let total = Number.POSITIVE_INFINITY;

  for (let page = 1; page <= maxPages && fetched < total; page++) {
    const response = await fetchPage(page);
    const elements = response.elements ?? [];
    if (elements.length === 0) break;
    fetched += elements.length;
    for (const country of elements) {
      if (!countries.has(country.id)) countries.set(country.id, country);
    }
    total = response.total ?? fetched;
  }

  return [...countries.values()];
}
