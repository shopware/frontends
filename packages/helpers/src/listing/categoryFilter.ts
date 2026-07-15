export const CATEGORY_AGGREGATION_NAME = "categories";
export const CATEGORY_COUNTS_AGGREGATION_NAME = "categories-counts";
export const CATEGORY_PARENTS_AGGREGATION_NAME = "categories-parents";

const CATEGORY_FIELD = "categoriesRo.id";

type CategoryEntityAggregation = {
  name: string;
  type: "entity";
  definition: "category";
  field: string;
};

type CategoryCountsAggregation = {
  name: string;
  type: "terms";
  field: string;
};

export type CategoryFilterBucket = {
  key: string;
  count: number;
} & {
  [nestedAggregationName: string]: unknown;
};

/**
 * Category aggregations for a listing filter: an entity `categories` agg plus a
 * flat `categories-counts` terms agg. Kept flat because the ES search route
 * returns no buckets once a nested sub-agg is attached, so variants overcount.
 *
 * @beta
 */
export function getCategoryFilterAggregations(): Array<
  CategoryEntityAggregation | CategoryCountsAggregation
> {
  return [
    {
      name: CATEGORY_AGGREGATION_NAME,
      type: "entity",
      definition: "category",
      field: CATEGORY_FIELD,
    },
    {
      name: CATEGORY_COUNTS_AGGREGATION_NAME,
      type: "terms",
      field: CATEGORY_FIELD,
    },
  ];
}

/**
 * Criteria `post-filter` entry narrowing a product listing to the given
 * category ids. Sent as a post-filter, it does not reduce the category
 * aggregations from `getCategoryFilterAggregations`, so all category options
 * stay visible while results are filtered (standard faceted behavior).
 *
 * @beta
 */
export function getCategoryFilterPostFilter(categoryIds: string[]): {
  field: string;
  type: "equalsAny";
  value: string;
} {
  return {
    field: CATEGORY_FIELD,
    type: "equalsAny",
    value: categoryIds.join("|"),
  };
}

/**
 * Product count for a `categories-counts` bucket. When the nested
 * `categories-parents` aggregation is present, variants collapse into their
 * parent product: each parent bucket counts as one product and the empty-key
 * bucket carries the standalone products.
 */
export function resolveCategoryBucketCount(
  bucket: CategoryFilterBucket,
): number {
  const parents = bucket[CATEGORY_PARENTS_AGGREGATION_NAME] as
    | { buckets?: Array<{ key: string | null; count: number }> }
    | undefined;
  if (!parents?.buckets) {
    return bucket.count;
  }
  let count = 0;
  for (const parent of parents.buckets) {
    count += parent.key ? 1 : parent.count;
  }
  return count;
}
