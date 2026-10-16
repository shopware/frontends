---
"@shopware/composables": minor
---

Added `useCacheableRead().invokeRead`. It uses the cacheable GET route only for a fresh default guest. That GET has no `sw-context-token`. Other sessions stay POST. Branching on `useShopwareContext().cacheableReads` is deprecated. New `createShopwareContext` option: `guestServerRender`. A category read over GET now sends its listing params as plain query params, so `limit` is no longer dropped.
