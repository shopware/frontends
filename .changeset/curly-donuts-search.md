---
"@shopware/helpers": minor
---

Add `getCategoryFilterAggregations()` and `getCategoryFilterPostFilter()` to request category aggregations for product listings and filter by category without reducing the aggregations. `getListingFilters` merges the `categories` and `categories-counts` response aggregations into a single `categories` filter with a product count per category.
