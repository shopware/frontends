// import { Sort } from "../search/SearchCriteria";
// import {
//   Aggregations,
//   AggregationFilterEntityOption,
//   AggregationProductListingEntities,
// } from "../search/Aggregations";
// import { CustomFields } from "../models/common/CustomField";
import type { Schemas } from "#shopware";

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
 * @deprecated use Schemas['ProductListingResult']['currentFilters'] from "#shopware" import instead
 */
export type ListingFilter = Schemas["ProductListingResult"]["currentFilters"];
// export type ListingFilter = {
//   id: string;
//   label: string;
//   name: string;
//   code: ListingFilterCode;
//   type?: "range" | "max";
//   options?: AggregationFilterEntityOption[];
//   entities?: AggregationProductListingEntities[];
//   min?: number; // TODO: prepare proper listing filters based on code
//   max?: number;
//   value?: string;
//   displayType?: ListingFilterDisplayType;
//   customFields?: CustomFields;
// };

/**
 * @deprecated use Schemas['ProductListingResult'] from "#shopware" import instead
 */
export type ListingResult = Schemas["ProductListingResult"];

//  {
//   /**
//    * apiAlias - determines the entity name that can be used within "includes" functionality (added in store-api)
//    */
//   apiAlias: string;
//   total: number;
//   elements: T[];
//   sorting: string;
//   page: number;
//   limit: number;
//   sortings: Sort[];
//   availableSortings: Sort[];
//   aggregations: Aggregations;
//   currentFilters: {
//     manufacturer: string[];
//     properties: string[];
//     price: { min: null | number; max: null | number };
//     rating: number;
//     search: string | null;
//     "shipping-free": boolean | null;
//   };
// };
