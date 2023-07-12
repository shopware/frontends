import {
  Aggregations,
  ListingFilter,
  AggregationFilterEntity,
  EntitiesAggregation,
  MaxAggregation,
  PriceAggregation,
} from "@shopware-pwa/types";
import { getTranslatedProperty } from "..";

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
export function getListingFilters(
  aggregations: Aggregations | undefined | null,
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
