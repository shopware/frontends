import { Sort } from "../search/SearchCriteria";
import {
  Aggregations,
  AggregationFilterEntityOption,
  AggregationProductListingEntities,
} from "../search/Aggregations";

/**
 * @public
 */
export type ListingFilterCode =
  | "manufacturer"
  | "properties"
  | "price"
  | "rating"
  | "search"
  | "shipping-free"
  | string;

export type ListingFilterDisplayType = "text" | "media";

/**
 * @public
 */
export type ListingFilter = {
  id: string;
  label: string;
  name: string;
  code: ListingFilterCode;
  type?: "range" | "max";
  options?: AggregationFilterEntityOption[];
  entities?: AggregationProductListingEntities[];
  min?: number; // TODO: prepare proper listing filters based on code
  max?: number;
  value?: string;
  displayType?: ListingFilterDisplayType;
};

export type ListingResult<T> = {
  /**
   * apiAlias - determines the entity name that can be used within "includes" functionality (added in store-api)
   */
  apiAlias: string;
  total: number;
  elements: T[];
  sorting: string;
  page: number;
  limit: number;
  sortings: Sort[];
  availableSortings: Sort[];
  aggregations: Aggregations;
  currentFilters: {
    manufacturer: string[];
    properties: string[];
    price: { min: null | number; max: null | number };
    rating: number;
    search: string | null;
    "shipping-free": boolean | null;
  };
};
