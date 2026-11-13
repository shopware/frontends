---
"@shopware/composables": patch
---

`useWishlist().mergeWishlistProducts()` now clears the local (localStorage) wishlist after merging it into the customer's wishlist. Before, it cleared the API wishlist instead: the local items stayed and were merged again on every login, and products the sync store still held from earlier in the session were removed from the customer's wishlist on the server.
