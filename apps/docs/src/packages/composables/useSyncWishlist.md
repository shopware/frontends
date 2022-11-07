---
category: CMS
---

# useSyncWishlist

Provides methods to get and send data to the backend related with wishlist. Only for logged-in users.

## Usage

```ts
const {
  getWishlistProducts,
  addToWishlistSync,
  removeFromWishlistSync,
  mergeWishlistProducts,
  items,
  count,
} = useSyncWishlist();
```
