import { CATEGORY_AGGREGATION_NAME } from "@shopware/helpers";

import type { operations } from "#shopware";

export type ListingSearchParams = Record<string, string | string[] | undefined>;

export const LISTING_DEFAULTS = {
  limit: 15,
  page: 1,
  order: "name-asc",
} as const;

export type ListingDefaults = {
  limit: number;
  page: number;
  order: string;
};

export const firstQueryValue = (
  value: string | string[] | undefined | null,
): string | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ?? undefined;
};

export const toNumber = (value: string | undefined): number | undefined => {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export type ListingFilterState = {
  manufacturer: string[];
  properties: string[];
  categories: string[];
  "min-price"?: number;
  "max-price"?: number;
  rating?: number;
  "shipping-free"?: boolean;
};

export type ListingState = {
  filters: ListingFilterState;
  order?: string;
  limit?: number;
  page?: number;
  search?: string;
};

export const createEmptyFilterState = (): ListingFilterState => ({
  manufacturer: [],
  properties: [],
  categories: [],
});

function splitValues(value: string | undefined): string[] {
  if (!value) return [];
  return value.split("|").filter(Boolean);
}

export function parseListingFilters(
  params: ListingSearchParams,
): ListingFilterState {
  const state = createEmptyFilterState();
  state.manufacturer = splitValues(firstQueryValue(params.manufacturer));
  state.properties = splitValues(firstQueryValue(params.properties));
  state.categories = splitValues(firstQueryValue(params.categories));

  const minPrice = toNumber(firstQueryValue(params["min-price"]));
  if (minPrice !== undefined) state["min-price"] = minPrice;
  const maxPrice = toNumber(firstQueryValue(params["max-price"]));
  if (maxPrice !== undefined) state["max-price"] = maxPrice;
  const rating = toNumber(firstQueryValue(params.rating));
  if (rating !== undefined) state.rating = rating;
  const shippingFree = firstQueryValue(params["shipping-free"]);
  if (shippingFree !== undefined)
    state["shipping-free"] = shippingFree === "true";

  return state;
}

export function parseListingState(params: ListingSearchParams): ListingState {
  return {
    filters: parseListingFilters(params),
    order: firstQueryValue(params.order),
    limit: toNumber(firstQueryValue(params.limit)),
    page: toNumber(firstQueryValue(params.p)),
    search: firstQueryValue(params.search),
  };
}

export function hasActiveFilters(
  filters: ListingFilterState,
  options: { isProductSearch?: boolean } = {},
): boolean {
  return (
    filters.manufacturer.length > 0 ||
    filters.properties.length > 0 ||
    (!!options.isProductSearch && filters.categories.length > 0) ||
    !!filters["min-price"] ||
    !!filters["max-price"] ||
    !!filters.rating ||
    !!filters["shipping-free"]
  );
}

export function buildListingQuery(
  state: ListingState,
  options: { isProductSearch?: boolean } = {},
): URLSearchParams {
  const query = new URLSearchParams();
  const { filters } = state;

  if (filters.manufacturer.length)
    query.set("manufacturer", filters.manufacturer.join("|"));
  if (filters.properties.length)
    query.set("properties", filters.properties.join("|"));
  if (options.isProductSearch && filters.categories.length)
    query.set("categories", filters.categories.join("|"));
  if (filters["min-price"])
    query.set("min-price", String(filters["min-price"]));
  if (filters["max-price"])
    query.set("max-price", String(filters["max-price"]));
  if (filters.rating) query.set("rating", String(filters.rating));
  if (filters["shipping-free"]) query.set("shipping-free", "true");
  if (state.order) query.set("order", state.order);
  if (options.isProductSearch && state.search)
    query.set("search", state.search);
  if (state.limit) query.set("limit", String(state.limit));
  if (state.page !== undefined) query.set("p", String(state.page));

  return query;
}

export type ListingQueryParams = Pick<
  NonNullable<
    operations["readProductListingGet get /product-listing/{categoryId}"]["query"]
  >,
  | "limit"
  | "p"
  | "order"
  | "manufacturer"
  | "properties"
  | "min-price"
  | "max-price"
  | "rating"
  | "shipping-free"
>;

export function buildListingQueryParams(
  params: ListingSearchParams,
  defaults: ListingDefaults = LISTING_DEFAULTS,
): ListingQueryParams {
  const state = parseListingState(params);
  const query: ListingQueryParams = {
    limit: state.limit ?? defaults.limit,
    p: state.page ?? defaults.page,
    order: state.order ?? defaults.order,
  };

  const { filters } = state;
  if (filters.manufacturer.length)
    query.manufacturer = filters.manufacturer.join("|");
  if (filters.properties.length)
    query.properties = filters.properties.join("|");
  if (filters["min-price"] !== undefined)
    query["min-price"] = filters["min-price"];
  if (filters["max-price"] !== undefined)
    query["max-price"] = filters["max-price"];
  if (filters.rating !== undefined) query.rating = filters.rating;
  if (filters["shipping-free"] !== undefined)
    query["shipping-free"] = filters["shipping-free"];

  return query;
}

export function hasListingQuery(params: ListingSearchParams): boolean {
  return [
    "manufacturer",
    "properties",
    "categories",
    "min-price",
    "max-price",
    "rating",
    "shipping-free",
    "order",
    "limit",
    "p",
  ].some((key) => firstQueryValue(params[key]) !== undefined);
}

export const getVisibleListingFilters = <FILTER extends { code: string }>(
  filters: FILTER[] | undefined | null,
  options: { isProductSearch: boolean },
): FILTER[] => {
  if (!filters) return [];
  if (options.isProductSearch) return filters;
  return filters.filter((filter) => filter.code !== CATEGORY_AGGREGATION_NAME);
};
