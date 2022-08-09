import { Sort } from "../search/SearchCriteria";
import { Aggregations } from "../search/Aggregations";

/**
 * @public
 */
export type ListingFilter = {
  id: string;
  label: string;
  name: string;
  code:
    | "manufacturer"
    | "properties"
    | "price"
    | "rating"
    | "search"
    | "shipping-free"
    | string;
  type?: "range" | "max";
  options?: Array<{ id: string; name: string }>;
  entities?: Array<{ id: string; name: string }>;
  min?: number; // TODO: prepare proper listing filters based on code
  max?: number;
  value?: string;
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
