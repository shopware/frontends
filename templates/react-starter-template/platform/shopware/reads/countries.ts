import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import { cacheLife, cacheTag } from "next/cache";

import { createShopwareClient } from "../client";
import {
  collectCountryPages,
  countryPageCriteria,
  toCountryOptions,
} from "./countryOptions";
import type { CountryOption } from "./countryOptions";

export async function readCountries(): Promise<CountryOption[]> {
  "use cache";
  cacheLife("reference");
  cacheTag("sw:countries");

  const client = createShopwareClient();
  const countries = await collectCountryPages((page) =>
    client
      .invoke("readCountryGet get /country", {
        query: { _criteria: encodeForQuery(countryPageCriteria(page)) },
      })
      .then((response) => response.data),
  );

  return toCountryOptions(countries);
}
