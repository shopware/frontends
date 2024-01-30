import { getTranslatedProperty } from "../getTranslatedProperty";

type AggregationFilterEntity = {
  name: string;
  id: string;
};

type EntitiesAggregation<T> = {
  entities: T[];
};

type PriceAggregation = {
  min: number;
  max: number;
};

type MaxAggregation = { max: number };

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

// biome-ignore lint/suspicious/noExplicitAny: Listing filters needs to be improved when schema types are ready
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
