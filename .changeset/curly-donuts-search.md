---
"@shopware/helpers": minor
---

Add `getCategoryFilterAggregations()` and `getCategoryFilterPostFilter()` to request category aggregations for product listings and filter by category without reducing the aggregations. `excludeRootCategory()` drops the sales channel entry point from the category entities, and the `CATEGORY_AGGREGATION_NAME` / `CATEGORY_COUNTS_AGGREGATION_NAME` / `CATEGORY_PARENTS_AGGREGATION_NAME` constants are exported for consumers that build the aggregations themselves.

`getListingFilters` (`@beta`) merges the `categories` and `categories-counts` response aggregations into a single `categories` filter with a product count per category. This changes the shape of that filter for listings that already requested a `categories` aggregation: the entities are sorted by count (highest first) instead of keeping the response order, each entity gains a `count`, the filter no longer carries the aggregation's `apiAlias`, and `categories-counts` is no longer returned as a filter of its own.
