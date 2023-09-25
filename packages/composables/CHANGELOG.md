# @shopware-pwa/composables-next

## 0.13.3

### Patch Changes

- [#372](https://github.com/shopware/frontends/pull/372) [`211ccbb2`](https://github.com/shopware/frontends/commit/211ccbb2e4d9d6009847e6ff53099deb97d569de) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix `loadOrderDetails` return type

- [#380](https://github.com/shopware/frontends/pull/380) [`b2b6905b`](https://github.com/shopware/frontends/commit/b2b6905beb8f28b79c0989ff9340c757e60001c9) Thanks [@SuddenDev](https://github.com/SuddenDev)! - Adds the ability to specify a query for the loadMore function in the useListing composable.

- [#390](https://github.com/shopware/frontends/pull/390) [`61de0366`](https://github.com/shopware/frontends/commit/61de03662869e9ad8b69e2d8a868313a61a7a741) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Catch 404 api error - `getWishlistProducts``

- [#385](https://github.com/shopware/frontends/pull/385) [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@vueuse/core_ from **^10.3.0** to **^10.4.1**

- Updated dependencies []:
  - @shopware-pwa/api-client@0.6.0
  - @shopware-pwa/helpers-next@0.4.0

## 0.13.2

### Patch Changes

- Updated dependencies [[`034e032`](https://github.com/shopware/frontends/commit/034e032270134cb51bb3da940d4b766d5866b1dd)]:
  - @shopware-pwa/helpers-next@0.4.0

## 0.13.1

### Patch Changes

- Updated dependencies [[`4532b60d`](https://github.com/shopware/frontends/commit/4532b60d449e1b5a45506fafa16eb7d156dc2359)]:
  - @shopware-pwa/api-client@0.6.0

## 0.13.0

### Minor Changes

- [#330](https://github.com/shopware/frontends/pull/330) [`3683116`](https://github.com/shopware/frontends/commit/3683116588a7ef75e750fc33deee119f038c88e8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `setCountry` method for `useSessionContext` composable

### Patch Changes

- [#336](https://github.com/shopware/frontends/pull/336) [`d03228a`](https://github.com/shopware/frontends/commit/d03228a51058ec376b003e80dd0395237a12bfb6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix link building for a cms image element

## 0.12.1

### Patch Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@vueuse/core_ from **^10.2.1** to **^10.3.0**

- Updated dependencies []:
  - @shopware-pwa/api-client@0.5.2
  - @shopware-pwa/helpers-next@0.3.2

## 0.12.0

### Minor Changes

- [#322](https://github.com/shopware/frontends/pull/322) [`b9a2004`](https://github.com/shopware/frontends/commit/b9a20044d3df04370c62ab392b5144a62fbb57a9) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `formatLink` method to the `useInternationalization` composable

### Patch Changes

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

- [#297](https://github.com/shopware/frontends/pull/297) [`8c6ff0a`](https://github.com/shopware/frontends/commit/8c6ff0ac87143a014f609aedd22aac99888da337) Thanks [@mkucmus](https://github.com/mkucmus)! - Remove implicit refresh action on address edit

- Updated dependencies [[`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d)]:
  - @shopware-pwa/api-client@0.5.2
  - @shopware-pwa/helpers-next@0.3.2

## 0.11.0

### Minor Changes

- [#284](https://github.com/shopware/frontends/pull/284) [`bb48e13`](https://github.com/shopware/frontends/commit/bb48e131570a2db4b7431c842e54ad67d9384cd5) Thanks [@mkucmus](https://github.com/mkucmus)! - Use function constructor instead of init method to set config for price displaying

### Patch Changes

- [#283](https://github.com/shopware/frontends/pull/283) [`e6a52ec`](https://github.com/shopware/frontends/commit/e6a52ec4b7c28627c55cbd8ca15b8458cedf53bd) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Fixed initial listing suring search

- [#295](https://github.com/shopware/frontends/pull/295) [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`14d97c5`](https://github.com/shopware/frontends/commit/14d97c5942adf5a49163625b2740d95bc5772689)]:
  - @shopware-pwa/api-client@0.5.1
  - @shopware-pwa/helpers-next@0.3.1

## 0.10.0

### Minor Changes

- [#281](https://github.com/shopware/frontends/pull/281) [`558c9d0`](https://github.com/shopware/frontends/commit/558c9d0f2127776a0542e8d1d95734cb5d4c7e75) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove refreshing cart from create order function

## 0.9.0

### Minor Changes

- [#212](https://github.com/shopware/frontends/pull/212) [`e359aa2`](https://github.com/shopware/frontends/commit/e359aa28c9c9c7fb2521be3ebd5b847c855e4d24) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Sort shipping methods on the getShippingMethods function

- [#280](https://github.com/shopware/frontends/pull/280) [`55db3a6`](https://github.com/shopware/frontends/commit/55db3a695ee6638f33f836890dad65742ddccf94) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add errorMessageBuilder to the useAddress composable

- [#230](https://github.com/shopware/frontends/pull/230) [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - useInternationalization add methods related to the language switcher

### Patch Changes

- [#271](https://github.com/shopware/frontends/pull/271) [`b9881b8`](https://github.com/shopware/frontends/commit/b9881b89da2605a5ccd78617d3f8ae8e05e8c43a) Thanks [@mkucmus](https://github.com/mkucmus)! - Clear addresses out of the store on failed address fetch

- [#252](https://github.com/shopware/frontends/pull/252) [`3ffd000`](https://github.com/shopware/frontends/commit/3ffd000195be60da9fbb3b41cd39fb9f4ab6167e) Thanks [@mkucmus](https://github.com/mkucmus)! - Correct function signature

- [#235](https://github.com/shopware/frontends/pull/235) [`b294182`](https://github.com/shopware/frontends/commit/b294182dbc9cda82a6d2b3c13663799a9f874c66) Thanks [@mkucmus](https://github.com/mkucmus)! - Readme enhancements

- [#255](https://github.com/shopware/frontends/pull/255) [`8a561b9`](https://github.com/shopware/frontends/commit/8a561b9aa12b50a816203c387417c2108761dcf9) Thanks [@mkucmus](https://github.com/mkucmus)! - Remove redundant api call for listing search

- [#243](https://github.com/shopware/frontends/pull/243) [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f)]:
  - @shopware-pwa/api-client@0.5.0
  - @shopware-pwa/helpers-next@0.3.0

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
