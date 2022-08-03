import { Sort } from "../search/SearchCriteria";
import { Aggregations } from "../search/Aggregations";

/**
 * @public
 */
export type ListingFilter = {
  label: string;
  code:
    | "manufacturer"
    | "properties"
    | "price"
    | "rating"
    | "search"
    | "shipping-free"
    | string;
  type?: "range" | "max";
  [key: string]: any;
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
