---
"@shopware/composables": minor
---

Added `useCacheableRead().invokeRead`. With `cacheableReads` on, it sends a read as the cacheable GET route, without `sw-context-token`, only when the loaded session and cart look like a fresh default guest; every other session stays POST. Branching on `useShopwareContext().cacheableReads` is deprecated. `createShopwareContext` takes a new `guestServerRender` option.
