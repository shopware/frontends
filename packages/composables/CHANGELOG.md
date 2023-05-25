# @shopware-pwa/composables-next

## 0.8.2

### Patch Changes

- [#220](https://github.com/shopware/frontends/pull/220) [`0242a3ad`](https://github.com/shopware/frontends/commit/0242a3adcde82e301f2e53fb562c0bbd767c04f9) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add clearWishlist function to the useWihslist composable

## 0.8.1

### Patch Changes

- updated changelog in readme

- Updated dependencies []:
  - @shopware-pwa/api-client@0.4.1
  - @shopware-pwa/helpers-next@0.2.1

## 0.8.0

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

## 0.7.1

### Patch Changes

- fixed published packages readme

- Updated dependencies []:
  - @shopware-pwa/api-client@0.3.1
  - @shopware-pwa/helpers-next@0.1.26

## 0.7.0

### Minor Changes

- [`d358854c`](https://github.com/shopware/frontends/commit/d358854c632447228e719efdf639c428cf6ba804) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add new ContextError and fix useListing category context

- [`ec030631`](https://github.com/shopware/frontends/commit/ec0306312fa42451f5f4a98c3e8985b70496fd37) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - useProductSearch add criteria as a parameter

- [`30493417`](https://github.com/shopware/frontends/commit/30493417ad5b97ee1f0553f68357a23446b85522) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Check if the cart is a virtual

### Patch Changes

- [`50e74be5`](https://github.com/shopware/frontends/commit/50e74be52034d1947e273985f778e986f077db44) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Return full url for storefrontURL

- [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b) Thanks [@mkucmus](https://github.com/mkucmus)! - JS-Doc improvements

- [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99) Thanks [@mkucmus](https://github.com/mkucmus)! - Prevent using mapped field configurations directly

- Updated dependencies [[`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2), [`dab0f839`](https://github.com/shopware/frontends/commit/dab0f839eeebe6bb9999cdd0ec11925d935b08b9), [`5008dcbf`](https://github.com/shopware/frontends/commit/5008dcbf065fc54a3f51517460e409556f370adf), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`e13d3d9a`](https://github.com/shopware/frontends/commit/e13d3d9adde759e97ca7fa9b7a782b7991428679), [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72), [`a15a3083`](https://github.com/shopware/frontends/commit/a15a308359497bb9d483bebe040d717114946ff0), [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067)]:
  - @shopware-pwa/helpers-next@0.1.25
  - @shopware-pwa/api-client@0.3.0

## 0.6.0

### Minor Changes

- [`313e0810`](https://github.com/shopware/frontends/commit/313e0810014611a0429b76b51747536630f24627) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add useBreadcrumbs composable for breadcrumbs management

### Patch Changes

- [`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f)]:
  - @shopware-pwa/api-client@0.2.3
  - @shopware-pwa/helpers-next@0.1.24

## 0.5.0

### Minor Changes

- [`4d5b04b5`](https://github.com/shopware/frontends/commit/4d5b04b5fa09910b0c02bc59b33534772da66eeb) Thanks [@patzick](https://github.com/patzick)! - `useCartItem` composable takes `Ref` instead of plain object as parameter

- [`c300b89b`](https://github.com/shopware/frontends/commit/c300b89b80cf3476e8023db1796cec972db519f8) Thanks [@patzick](https://github.com/patzick)! - Changed `useCart` in now a shared composable, so there is only one instance.

- [`0855add8`](https://github.com/shopware/frontends/commit/0855add83ca04e816caed65a0538c1dbf624bb0d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add the URL query navigation to the product listing

### Patch Changes

- [`57d720ab`](https://github.com/shopware/frontends/commit/57d720ab6c8f605de605dbbe9de53d4ce43347e5) Thanks [@mkucmus](https://github.com/mkucmus)! - Avoid wishlist sync for guest session

- [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4) Thanks [@patzick](https://github.com/patzick)! - start deploying canary versions

- [`0a8f4ea1`](https://github.com/shopware/frontends/commit/0a8f4ea1a95cd684178ae412687575bf735894a7) Thanks [@mkucmus](https://github.com/mkucmus)! - Homepage resolving

- [`77a0bbcd`](https://github.com/shopware/frontends/commit/77a0bbcd8a5ce830219e2c04c0c99d08e6c4f4f2) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing VueUse

- [`39d2d11c`](https://github.com/shopware/frontends/commit/39d2d11c922f5de9eb5d5c25225b6b93edd8ebcb) Thanks [@mkucmus](https://github.com/mkucmus)! - Payment related processes and documentation

- [`4fc1cd83`](https://github.com/shopware/frontends/commit/4fc1cd833a9ebca73536b2be45cfec35f6a27dfc) Thanks [@mkucmus](https://github.com/mkucmus)! - Explains an usage of useAddToCart composable

- [`f364da48`](https://github.com/shopware/frontends/commit/f364da4881b2c172947e394fcd8e23ddc3689a51) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove setting default address in createCustomerAddress function

- [`21d8331a`](https://github.com/shopware/frontends/commit/21d8331aff13cef7ed041c60376504b2f324c1f5) Thanks [@mkucmus](https://github.com/mkucmus)! - Move checkout-related methods to useCheckout composable

- Updated dependencies [[`29deb04f`](https://github.com/shopware/frontends/commit/29deb04fd1a871cb28f1fe3af3c007ae21de999f), [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4)]:
  - @shopware-pwa/api-client@0.2.2
  - @shopware-pwa/helpers-next@0.1.23

## 0.4.0

### Minor Changes

- [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb) Thanks [@patzick](https://github.com/patzick)! - improved session context to be better handled on SSR

### Patch Changes

- [`7310ca6`](https://github.com/shopware/frontends/commit/7310ca64506ca5418d3ec2ef80f5c7d0fe4b779c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Prevent merging empty local wishlist (backend related)

- Updated dependencies []:
  - @shopware-pwa/api-client@0.2.1
  - @shopware-pwa/helpers-next@0.1.22

## 0.3.0

### Minor Changes

- [`b3f711c`](https://github.com/shopware/frontends/commit/b3f711ccb230025c0567b0a06a292bf9255a4992) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - ability to check if user is subscribed to newsletter

- [`c0b9cc3`](https://github.com/shopware/frontends/commit/c0b9cc35fdb588ef5e580dc7e19fa4414ba64d04) Thanks [@mkucmus](https://github.com/mkucmus)! - Price displaying strategy

### Patch Changes

- [`9cd4078`](https://github.com/shopware/frontends/commit/9cd4078433c5644d2153a8a1212b9076a8d37347) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix setDefaultCustomerPaymentMethod api url and context

- [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`b3f711c`](https://github.com/shopware/frontends/commit/b3f711ccb230025c0567b0a06a292bf9255a4992), [`9cd4078`](https://github.com/shopware/frontends/commit/9cd4078433c5644d2153a8a1212b9076a8d37347), [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953)]:
  - @shopware-pwa/api-client@0.2.0
  - @shopware-pwa/helpers-next@0.1.21

## 0.2.1

### Patch Changes

- update dependency

## 0.2.0

### Minor Changes

- [`16ee1d5`](https://github.com/shopware/frontends/commit/16ee1d52f76dc62ac5931dfd2ef0c428096db960) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - set default user addresses

## 0.1.20

### Patch Changes

- fa7e48f: Added changelog and readme file
- Updated dependencies [fa7e48f]
  - @shopware-pwa/api-client@0.1.20
  - @shopware-pwa/helpers-next@0.1.20
