---
"@shopware/helpers": minor
---

Add three helpers that were previously only available inside composables:

- `getListingFiltersQuery(filters)` turns listing criteria into URL query params. Arrays are joined with `|`, and empty arrays and falsy values are left out. It is what `useListing().filtersToQuery` does, now usable outside a component.
- `getCmsMeta(entity)` returns the translated `title`, `metaTitle`, `metaDescription` and `keywords` of a category, product or landing page, with an empty string for a missing field.
- `getTotalPages(total, limit)` returns the page count, or `0` when `limit` is not a positive number.
