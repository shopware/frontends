import {
  LtRangeFilter,
  GtRangeFilter,
  LteRangeFilter,
  GteRangeFilter,
  LtGtRangeFilter,
  LtGteRangeFilter,
  LteGtRangeFilter,
  LteGteRangeFilter,
} from "./RangeFilters";

/**
 * @beta
 */
export type SearchFilterType =
  | "equals"
  | "contains"
  | "equalsAny"
  | "not"
  | "multi"
  | "range"
  | "max";

/**
 * @beta
 */
export type SearchFilter = {
  type: SearchFilterType;
};

/**
 * @beta
 */
export type EqualsFilter = SearchFilter & {
  value: string | null;
  field: string;
};

/**
 * @beta
 */
export type EqualsAnyFilter = SearchFilter & {
  value: string[];
  field: string;
};

/**
 * @beta
 */
export type ContainsFilter = SearchFilter & {
  value: string[];
  field: string;
};

/**
 * @public
 */
export type RangeFilter = SearchFilter & {
  field: string;
  parameters:
    | LtRangeFilter
    | GtRangeFilter
    | LteRangeFilter
    | GteRangeFilter
    | LtGtRangeFilter
    | LtGteRangeFilter
    | LteGtRangeFilter
    | LteGteRangeFilter;
};

/**
 * @beta
 */
export type MaxFilter = SearchFilter & {
  field: string;
  max: number;
};

/**
 * @beta
 */
export type MultiFilter = SearchFilter & {
  operator: string;
  queries: Array<
    EqualsAnyFilter | RangeFilter | ContainsFilter | EqualsFilter | MultiFilter
  >;
};

/**
 * @beta
 */
export type NotFilter = {
  type: "not";
  queries: Array<
    EqualsAnyFilter | RangeFilter | ContainsFilter | EqualsFilter | MultiFilter
  >;
};
