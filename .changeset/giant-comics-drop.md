---
"@shopware-pwa/composables-next": major
---

Removed deprecations from the composables:

- `createShopwareContext` is no longer accpting `apiInstance` option. Use `apiClient` instead.
- `useCart` - `getProductItemsSeoUrlsData` is removed. Use product related methods to fetch an item's URL instead.
- `useCartItem` - `getProductItemSeoUrlData` is removed
- `apiInstance` is not exposing `apiInstance` anymore. Use `apiClient` instead.
