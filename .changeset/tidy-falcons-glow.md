---
"@shopware/cms-base-layer": minor
---

`SwProductListingFilters` and `SwProductListingFiltersHorizontal`: honor the `listingType` prop. When set to `productSearchListing` the components drive `useProductSearchListing` instead of `useCategoryListing` and keep the active search term in the request criteria and resulting URL, so the shared filter sidebar can be reused on the product search page without resetting the query. Category listing behavior is unchanged.
