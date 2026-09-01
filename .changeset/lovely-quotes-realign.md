---
"@shopware/composables": patch
---

Realign the composables with the `6.7.13.0` Store API schema:

- `useB2bQuoteManagement`: `getQuote()` now invokes `readQuote post /quote/{id}` (was `readQuote post /quote/detail/{id}`) and `createOrderFromQuote()` now invokes `createOrderFromQuote post /quote/{id}/order` (was `createOrderFromQuote post /quote/order/{id}`), matching the renamed endpoints.
- `useListing`: `getSortingOrders` is typed as `Schemas["ProductListingResult"]["availableSortings"]` instead of the removed `Schemas["ProductSorting"][]`.
- `useProductSearch`: the `associations` option is typed as `Partial<Schemas["Associations"]>` instead of the removed `Schemas["Association"]`.
