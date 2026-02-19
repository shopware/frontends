---
"@shopware/composables": minor
---

Add `options` parameter with `isDeepLinkCode` flag to `useOrderDetails` composable. When enabled, the order is fetched using a deep link code filter instead of an order ID, enabling guest order lookups without authentication.
