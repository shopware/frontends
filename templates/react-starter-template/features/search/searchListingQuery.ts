import {
  buildListingQueryParams,
  parseListingFilters,
} from "@shopware/cms-base-layer-react";
import type {
  ListingQueryParams,
  ListingSearchParams,
} from "@shopware/cms-base-layer-react";

const CATEGORY_ID = /^[0-9a-f]{32}$/i;

export type SearchListingQuery = {
  query: ListingQueryParams;
  categoryIds: string[];
};

export function buildSearchListingQuery(
  searchParams: ListingSearchParams,
): SearchListingQuery {
  return {
    query: buildListingQueryParams(searchParams),
    categoryIds: parseListingFilters(searchParams).categories.filter((id) =>
      CATEGORY_ID.test(id),
    ),
  };
}
