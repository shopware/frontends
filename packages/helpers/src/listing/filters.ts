import { getTranslatedProperty } from "../getTranslatedProperty";
import {
  CATEGORY_AGGREGATION_NAME,
  CATEGORY_COUNTS_AGGREGATION_NAME,
  type CategoryFilterBucket,
  resolveCategoryBucketCount,
} from "./categoryFilter";

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
  options?: Array<{ id: string; translated?: { name?: string } }>;
  entities?: Array<{
    id: string;
    translated?: { name?: string };
    count?: number;
  }>;
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

function getCategoryFilter(
  aggregation: EntitiesAggregation<AggregationFilterEntity>,
  countsAggregation?: { buckets?: CategoryFilterBucket[] },
): ListingFilter {
  const countByCategoryId = new Map<string, number>();
  for (const bucket of countsAggregation?.buckets ?? []) {
    countByCategoryId.set(bucket.key, resolveCategoryBucketCount(bucket));
  }
  const entities = aggregation.entities
    .map((entity) => ({
      ...entity,
      // Count per category: kept on the entity and used to sort, but not
      // rendered yet - it overcounts variants on the search route.
      count: countByCategoryId.get(entity.id),
    }))
    .sort(
      (a, b) =>
        (b.count ?? 0) - (a.count ?? 0) ||
        getTranslatedProperty(a, "name").localeCompare(
          getTranslatedProperty(b, "name"),
        ),
    );
  return {
    label: CATEGORY_AGGREGATION_NAME,
    code: CATEGORY_AGGREGATION_NAME,
    id: CATEGORY_AGGREGATION_NAME,
    name: CATEGORY_AGGREGATION_NAME,
    entities,
  };
}

/**
 * @beta
 */

// TODO: Listing filters need better schema-backed types.
export function getListingFilters<T extends Record<string, any>>(
  aggregations: T | undefined | null,
): ListingFilter[] {
  if (!aggregations) {
    return [] as ListingFilter[];
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
    } else if (
      aggregationName === CATEGORY_AGGREGATION_NAME &&
      isEntitiesAggregation(aggregation)
    ) {
      transformedFilters.push(
        getCategoryFilter(
          aggregation,
          aggregations[CATEGORY_COUNTS_AGGREGATION_NAME],
        ),
      );
    } else if (
      !["properties", "options", CATEGORY_COUNTS_AGGREGATION_NAME].includes(
        aggregationName,
      )
    ) {
      transformedFilters.push(getFilter(aggregationName, aggregation));
    }
  }

  return transformedFilters;
}
