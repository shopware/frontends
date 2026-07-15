---
"@shopware/cms-base-layer": minor
---

`SwProductListingFilters` and `SwProductListingFiltersHorizontal` render a new `SwFilterCategories` checkbox filter when the listing response contains the category aggregations from `getCategoryFilterAggregations()`. The selection is kept in the `categories` URL param and applied as a criteria `post-filter`. Listings without these aggregations are unaffected.
