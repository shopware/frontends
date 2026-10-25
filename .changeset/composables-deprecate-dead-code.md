---
"@shopware/composables": patch
---

Deprecate API that has no effect, to be removed in the next major release:

- `createShopwareContext`: the `enableDevtools` option and the `state` property of the returned plugin
- `useProductAssociations`: the `associationContext` option and the `method` and `searchParams` params of `loadAssociations`. Both `options` and the `loadAssociations` params are now optional, so call `loadAssociations()`
- `useProductConfigurator().isLoadingOptions` and `useSyncWishlist().isLoading`, which are never updated
- `getDefaultApiParams`, which already logged a deprecation error, now carries the `@deprecated` tag as well
- the unused, unexported `registerShopwareDevtools` and `useCmsElementProductBox`

Also removes commented-out code. No runtime behaviour changes.
