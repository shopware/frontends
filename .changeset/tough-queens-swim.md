---
"vue-demo-store": minor
"@shopware-pwa/composables-next": minor
---

Added a pagination for the wishlist page (for logged in users).

## Composable changes

- `useWishList` composable changes
  - Added `getCurrentPage` and `getTotalPagesCount` to the returned object
  - Changed `getWishlistProducts` to accept `page` and `query` as optional parameters
- `useSyncWishList` composable changes
  - Changed `getWishlistProducts`, added Parameter to pass default criterias
