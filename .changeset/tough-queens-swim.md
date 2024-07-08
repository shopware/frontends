---
"vue-demo-store": minor
"@shopware-pwa/composables-next": minor
---

Added a pagination for the wishlist page (for logged in users).

## Composable changes

- `useWishList` composable changes
  - Added `changeCurrentPage`, `getCurrentPage`, `getTotalPagesCount` to the returned object
- `useSyncWishList` composable changes
  - Changed `getWishlistProducts`, added Parameter to pass default criterias
