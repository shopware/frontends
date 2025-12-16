---
"@shopware/cms-base-layer": minor
---

- Extract product listing data early from CMS page responses to enable SSR rendering
- Remove ClientOnly wrappers from `SwProductListingFilters` and `SwFilterChips` components
- Resolve hydration mismatches on category pages with filters
