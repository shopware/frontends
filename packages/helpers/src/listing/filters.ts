import type {
  AggregationFilterEntity,
  EntitiesAggregation,
  MaxAggregation,
  PriceAggregation,
} from "@shopware-pwa/types";
import { getTranslatedProperty } from "..";

type ListingFilter = {
  label: string;
  code: string;
  id: string;
  name: string;
};

const getFilter = <T extends { name: string; id: string }>(
  code: string,
  aggregation: T,
): ListingFilter => {
  return {
    label: getTranslatedProperty(aggregation, "name") || code,
    code,
    ...aggregation,
  };
};

function isEntitiesAggregation(
  aggregation:
    | EntitiesAggregation<AggregationFilterEntity>
    | PriceAggregation
    | MaxAggregation,
): aggregation is EntitiesAggregation<AggregationFilterEntity> {
  return (
    (aggregation as EntitiesAggregation<AggregationFilterEntity>).entities !==
    undefined
  );
}

/**
 * @beta
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getListingFilters<T extends Record<string, any>>(
  aggregations: T | undefined | null,
): ListingFilter[] {
  if (!aggregations) {
    return [];
  }

  const transformedFilters: ListingFilter[] = [];
  for (const [aggregationName, aggregation] of Object.entries(aggregations)) {
    if (
      aggregationName === "properties" &&
      isEntitiesAggregation(aggregation)
    ) {
      for (const filterEntity of aggregation.entities) {
        transformedFilters.push(getFilter(aggregationName, filterEntity));
      }
    } else if (!["properties", "options"].includes(aggregationName)) {
      transformedFilters.push(getFilter(aggregationName, aggregation));
    }
  }

  return transformedFilters;
}
