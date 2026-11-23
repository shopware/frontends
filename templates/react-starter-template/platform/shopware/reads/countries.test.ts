import { encodeForQuery } from "@shopware/api-client/helpers";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Schemas } from "#shopware";

import { readCountries } from "./countries";
import { countryPageCriteria } from "./countryOptions";

const api = vi.hoisted(() => ({ invoke: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: () => {}, cacheTag: () => {} }));
vi.mock("../client", () => ({
  createShopwareClient: () => ({ invoke: api.invoke }),
}));

function country(index: number): Schemas["Country"] {
  return {
    id: `country-${index}`,
    name: `Country ${index}`,
    iso: "de",
    translated: { name: `Country ${index}` },
  } as Schemas["Country"];
}

const allCountries = Array.from({ length: 150 }, (_, index) => country(index));

beforeEach(() => {
  api.invoke.mockReset();
  api.invoke.mockImplementation(
    async (_operation: string, { query }: { query: { _criteria: string } }) => {
      const page = [1, 2].find(
        (candidate) =>
          query._criteria === encodeForQuery(countryPageCriteria(candidate)),
      );
      if (!page) throw new Error(`Unexpected criteria ${query._criteria}`);
      return {
        data: {
          elements: allCountries.slice((page - 1) * 100, page * 100),
          total: allCountries.length,
        },
      };
    },
  );
});

describe("readCountries", () => {
  it("reads every page through the cacheable GET route", async () => {
    const countries = await readCountries(null);

    expect(api.invoke).toHaveBeenCalledTimes(2);
    for (const [index, page] of [1, 2].entries()) {
      expect(api.invoke).toHaveBeenNthCalledWith(
        index + 1,
        "readCountryGet get /country",
        { query: { _criteria: encodeForQuery(countryPageCriteria(page)) } },
      );
    }
    expect(countries).toHaveLength(150);
    expect(countries[149]).toEqual({
      id: "country-149",
      name: "Country 149",
      iso: "DE",
      states: [],
    });
  });
});
