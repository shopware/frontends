# shopware/frontends - composables

Welcome to `@shopware-pwa/composables-next` package.

For getting started documentation visit [https://frontends.shopware.com/](https://frontends.shopware.com/)

Documentation specific for this package: [composables](https://frontends.shopware.com/packages/composables.html)

<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/composables/CHANGELOG.md)

### Latest changes: 0.8.0

### Minor Changes

- [#158](https://github.com/shopware/frontends/pull/158) [`693f9829`](https://github.com/shopware/frontends/commit/693f9829d5082307cb1f3b18d5b0217e42c6cf68) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add associations parameter to the useOrderDetails composable

- [#187](https://github.com/shopware/frontends/pull/187) [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - getShippingMethods - add price associations and merge option

### Patch Changes

- [#82](https://github.com/shopware/frontends/pull/82) [`0e85ad14`](https://github.com/shopware/frontends/commit/0e85ad14c7a115a9e4e79cb3d89e41129be30f03) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Don't refresh the context when after registration user is not activated (useUser)

- [#189](https://github.com/shopware/frontends/pull/189) [`3764736e`](https://github.com/shopware/frontends/commit/3764736e52fffb7f7abeb4c044dee2adc812cbb6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix isVirtualCart method - check length before use `every` method

- [#137](https://github.com/shopware/frontends/pull/137) [`e03c67a8`](https://github.com/shopware/frontends/commit/e03c67a8d553694be6e14e2c8d1a3f99b1b2ffbe) Thanks [@mkucmus](https://github.com/mkucmus)! - Safe check for navigator on SSR and fallback locale

- [#116](https://github.com/shopware/frontends/pull/116) [`1fd1962f`](https://github.com/shopware/frontends/commit/1fd1962f7f4ee26461e8918e70e5f686fa431c6d) Thanks [@mkucmus](https://github.com/mkucmus)! - Intl as a price formatter

- [#179](https://github.com/shopware/frontends/pull/179) [`bb64070f`](https://github.com/shopware/frontends/commit/bb64070f69e47c14653c524d864f7a8ab8290724) Thanks [@patzick](https://github.com/patzick)! - Currency and price context are properly set during the hydration. `usePrice` is not a shared composable.

- [#168](https://github.com/shopware/frontends/pull/168) [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57) Thanks [@mkucmus](https://github.com/mkucmus)! - `getProductItemSeoUrlData` method of `useCart` marked as deprecated

- [#149](https://github.com/shopware/frontends/pull/149) [`8dc64e31`](https://github.com/shopware/frontends/commit/8dc64e31756e8509866efdc2b52915b8862598cb) Thanks [@mkucmus](https://github.com/mkucmus)! - Safe parameters access

- [#168](https://github.com/shopware/frontends/pull/168) [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57) Thanks [@mkucmus](https://github.com/mkucmus)! - Add item total price property for useCartItem composable

- Updated dependencies [[`81f45335`](https://github.com/shopware/frontends/commit/81f4533513b2ee538111159f8e37cd7bd1db9f1e), [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b), [`0188b36a`](https://github.com/shopware/frontends/commit/0188b36acdf43278163a2fee74ff5b1c1aba55d8)]:
  - @shopware-pwa/helpers-next@0.2.0
  - @shopware-pwa/api-client@0.4.0
