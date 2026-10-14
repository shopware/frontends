import "server-only";
import { encodeForQuery } from "@shopware/api-client/helpers";
import type { ListingQueryParams } from "@shopware/cms-base-layer-react";
import {
  getCategoryFilterAggregations,
  getCategoryFilterPostFilter,
} from "@shopware/helpers";
import { cacheLife, cacheTag } from "next/cache";

import type { Schemas, operations } from "#shopware";

import { createShopwareClient } from "../client";
import { languageCacheTags } from "./cacheTags";

type SearchPageGetQuery = NonNullable<
  operations["searchPageGet get /search"]["query"]
> & { _criteria?: string };

export function productSearchCriteria(
  categoryIds: readonly string[],
): Record<string, unknown> {
  const criteria: Record<string, unknown> = {
    aggregations: getCategoryFilterAggregations(),
  };
  if (categoryIds.length > 0) {
    criteria["post-filter"] = [getCategoryFilterPostFilter([...categoryIds])];
  }
  return criteria;
}

export async function readProductSearch(
  search: string,
  query: ListingQueryParams,
  categoryIds: string[],
  languageId: string | null,
): Promise<Schemas["ProductListingResult"]> {
  "use cache";
  cacheLife("listing");
  cacheTag(...languageCacheTags("sw:search", languageId));

  const response = await createShopwareClient({ languageId }).invoke(
    "searchPageGet get /search",
    {
      headers: { "sw-include-seo-urls": true },
      query: {
        ...query,
        search,
        _criteria: encodeForQuery(productSearchCriteria(categoryIds)),
      } as SearchPageGetQuery,
    },
  );

  return response.data;
}
