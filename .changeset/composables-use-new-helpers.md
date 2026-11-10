---
"@shopware/composables": patch
---

`useListing().filtersToQuery`, `useCmsMeta` and the page counts of `useListing`, `useWishlist` and `useCustomerOrders` now use the new `getListingFiltersQuery`, `getCmsMeta` and `getTotalPages` helpers from `@shopware/helpers`. The only behaviour change: with a limit of `0` or less, the page count is now `0` instead of `Infinity` or `NaN`.

Deprecated, to be removed in the next major release:

- `useListing().filtersToQuery`: use `getListingFiltersQuery` from `@shopware/helpers`
- `useCmsMeta`: use `getCmsMeta` from `@shopware/helpers`
