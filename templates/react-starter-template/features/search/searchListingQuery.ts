import { buildListingQueryParams, parseListingFilters } from "@/cms";
import type { ListingQueryParams, ListingSearchParams } from "@/cms";

const CATEGORY_ID = /^[0-9a-f]{32}$/i;

export type SearchListingQuery = {
  query: ListingQueryParams;
  categoryIds: string[];
};

export function buildSearchListingQuery(
  searchParams: ListingSearchParams,
): SearchListingQuery {
  return {
    query: buildListingQueryParams(searchParams, { page: 1 }),
    categoryIds: parseListingFilters(searchParams).categories.filter((id) =>
      CATEGORY_ID.test(id),
    ),
  };
}
