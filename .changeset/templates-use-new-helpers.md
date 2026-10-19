---
"vue-starter-template": patch
"vue-demo-store": patch
---

`useCmsHead` reads the entity's title and meta fields with `getCmsMeta` from `@shopware/helpers` instead of the deprecated `useCmsMeta`, and the demo store's listing filters build the query with `getListingFiltersQuery` instead of the deprecated `useListing().filtersToQuery`. The rendered head tags and URLs are unchanged.
