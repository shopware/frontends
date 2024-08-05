# @shopware-pwa/composables-next

## 1.2.0

### Minor Changes

- [#1194](https://github.com/shopware/frontends/pull/1194) [`aa8f5a4`](https://github.com/shopware/frontends/commit/aa8f5a4d2eabce1d6119e31af8c7479911d7b07b) Thanks [@patzick](https://github.com/patzick)! - New `useDefaultOrderAssociations` composable to be used or overriden separately in user project. This composable just returns default associations object.

### Patch Changes

- Updated dependencies [[`2e4c887`](https://github.com/shopware/frontends/commit/2e4c8872060fb2ebabe5b89d92761994a2ed8128)]:
  - @shopware-pwa/helpers-next@1.0.2

## 1.1.1

### Patch Changes

- [#1074](https://github.com/shopware/frontends/pull/1074) [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4) Thanks [@mkucmus](https://github.com/mkucmus)! - `useOrderDetails` - Load shipping address for the order details. Ivoking a `loadOrderDetails` method now will fetch also a `shippingOrderAddress` association.

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Migrate eslint config to flat format

- [#1099](https://github.com/shopware/frontends/pull/1099) [`3bde5fe`](https://github.com/shopware/frontends/commit/3bde5fe6d4a9c31d380defc05a7903cf99cb8136) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - `useCart` - Fixed adding promotion code

- Updated dependencies [[`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4), [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6), [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4)]:
  - @shopware-pwa/helpers-next@1.0.1
  - @shopware/api-client@1.0.2

## 1.1.0

### Minor Changes

- [#1071](https://github.com/shopware/frontends/pull/1071) [`f9d2735`](https://github.com/shopware/frontends/commit/f9d27353ec6383cb22cdece0469f8fdd13250958) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - `useCart` - new `addProducts` function that allows adding a set of products to the cart

- [#893](https://github.com/shopware/frontends/pull/893) [`d95751e`](https://github.com/shopware/frontends/commit/d95751ecde443a033f17def838bcc25aeba6951e) Thanks [@khanSoliheen](https://github.com/khanSoliheen)! - - `useWishList`:
  - Added `getCurrentPage` and `getTotalPagesCount` to the returned object
  - Changed `getWishlistProducts` to accept `page` and `query` as optional parameters
  - `useSyncWishList`:
    - Changed `getWishlistProducts`, added Parameter to pass default criterias

## 1.0.1

### Patch Changes

- [#1076](https://github.com/shopware/frontends/pull/1076) [`1954022`](https://github.com/shopware/frontends/commit/19540220d87788eed08991d35aaaead2e18564e5) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - `useOrderDetails` - Adding `stateMachineState` as the default association to the composable

- [#1078](https://github.com/shopware/frontends/pull/1078) [`19f2800`](https://github.com/shopware/frontends/commit/19f28003cf937bcb630257cb7cfd2bd131b7cf9d) Thanks [@patzick](https://github.com/patzick)! - `useListing` - reverted usage of the `sw-include-swo-urls` header in the search request

- Updated dependencies [[`19f2800`](https://github.com/shopware/frontends/commit/19f28003cf937bcb630257cb7cfd2bd131b7cf9d)]:
  - @shopware/api-client@1.0.1

## 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#1056](https://github.com/shopware/frontends/pull/1056) [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04) Thanks [@patzick](https://github.com/patzick)! - Removed deprecations from the composables:

  - `createShopwareContext` is no longer accpting `apiInstance` option. Use `apiClient` instead.
  - `useCart` - `getProductItemsSeoUrlsData` is removed. Use product related methods to fetch an item's URL instead.
  - `useCartItem` - `getProductItemSeoUrlData` is removed
  - `apiInstance` is not exposing `apiInstance` anymore. Use `apiClient` instead.

- [#452](https://github.com/shopware/frontends/pull/452) [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2) Thanks [@patzick](https://github.com/patzick)! - Created Nuxt layer for `composables` and `cms-base`. This way overriding any part of that is now possible.

- [#978](https://github.com/shopware/frontends/pull/978) [`479357c`](https://github.com/shopware/frontends/commit/479357c74d40c99218eb22ccd4089357ffab5872) Thanks [@patzick](https://github.com/patzick)! - `useCustomerPassword` and `loadCustomerAddresses` inside `useAddress` are now throwing api errors on invocation. The `errors` object has been removed from the composable to make consistent error handling across the composables. This change is breaking and requires you to update your implementation of the composables.

  Example of error handling for resseting password:

  ```typescript
  const {
    resetPassword,
    // errors --> removed from the API
  } = useCustomerPassword();

  const errors = ref([]);

  const invokeRecover = async (): Promise<void> => {
    try {
      errors.value = [];
      const emailSent = await resetPassword(formData.value);

      if (emailSent.success) {
        // here we know that email was sent
      }
    } catch (error) {
      console.error("[AccountRecoverPassword]", error);
      if (error instanceof ApiClientError) {
        errors.value = error.details?.errors || [];
      }
    }
  };
  ```

### Minor Changes

- [#991](https://github.com/shopware/frontends/pull/991) [`38a3853`](https://github.com/shopware/frontends/commit/38a385374a99d114c4ed3477f14c9e06dedb0dcd) Thanks [@patzick](https://github.com/patzick)! - Few changes in composables API to access data returned from the backend:

  - `useAddress` - `loadCustomerAddresses` returns addresses now
  - `useCart` - `removeItem` returns updated cart
  - `useCartItem` - `removeItem` returns updated cart, similar to `useCart`
  - `fetchCountries` - returns countries with the response
  - `useNewsletter` - `getNewsletterStatus` returns full response from the API
  - `useOrderDetails` - `loadOrderDetails` returns order details now, `cancel` returns order state, `changePaymentMethod` returns success response info
  - `changePaymentMethod` - `changePaymentMethod` returns success response info now
  - `useProductReviews` - `loadProductReviews` returns reviews response now
  - `useSalutations` - `fetchSalutations` returns salutations response now
  - `useUser` - `refreshUser` returns customer data. `logout`, `loadCountry` and `loadSalutation` returns data from the API

- [#840](https://github.com/shopware/frontends/pull/840) [`823aa9b`](https://github.com/shopware/frontends/commit/823aa9b4626c8931d2bea1399e825162c44fd45c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Return `componentNameToResolve` in resolveCmsComponent function

- [#529](https://github.com/shopware/frontends/pull/529) [`4dce006`](https://github.com/shopware/frontends/commit/4dce006460611e59fed084511ca9ecb814f95cf1) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - **BREAKING**: Use product ID instead of whole product object in `useProductWishlist` composable

- [#535](https://github.com/shopware/frontends/pull/535) [`bebae42`](https://github.com/shopware/frontends/commit/bebae42e58e3dd47f13bf166b0fb0d8ac9a416e3) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix country ID in session context
  Add `salesChannelCountryId` that represent sales channel default city ID

- [#986](https://github.com/shopware/frontends/pull/986) [`013a1d6`](https://github.com/shopware/frontends/commit/013a1d6f88377686cfc1a85903a0c48d8fda67f5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added tests to achieve coverage > 80%

- [#933](https://github.com/shopware/frontends/pull/933) [`04ac2ad`](https://github.com/shopware/frontends/commit/04ac2ada522c881bb06565c332baf5f2cf08643d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Added `checkPromotion` attribute to the `orderAssociations`

  - Added `statusTechnicalName` property to the `useOrderDetails` composable
  - Added `getPaymentMethods` method that allows change payment for existed order
  - Added `stateMachineState` association for loading orders

- [#1027](https://github.com/shopware/frontends/pull/1027) [`05ca5b6`](https://github.com/shopware/frontends/commit/05ca5b68f098bc8969c2c50e270b19b00938513c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added `useCategorySearch` and `useCmsElementProductBox` tests

- [#703](https://github.com/shopware/frontends/pull/703) [`7a3a92c`](https://github.com/shopware/frontends/commit/7a3a92c3ee1a337e752adbcfa5057d30064eed7c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add B2b quote management composable

### Patch Changes

- [#569](https://github.com/shopware/frontends/pull/569) [`f1b2a30`](https://github.com/shopware/frontends/commit/f1b2a307de58e0f296edab3222b7cd5684104347) Thanks [@itscark](https://github.com/itscark)! - Fix only available shipping methods

- [#880](https://github.com/shopware/frontends/pull/880) [`2ade07a`](https://github.com/shopware/frontends/commit/2ade07ad51944eebb7d1962c36823875cd5e959e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Adjust types in `useProductSearch` composable

- [#915](https://github.com/shopware/frontends/pull/915) [`fc262dd`](https://github.com/shopware/frontends/commit/fc262dd3a93338353394c03faf7fee36a0c36511) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Handle using categoryId as a alternative for category context

- [#1042](https://github.com/shopware/frontends/pull/1042) [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f) Thanks [@patzick](https://github.com/patzick)! - Completely removed dependency to the deprecated `@shopware-pwa/types` package

- [#873](https://github.com/shopware/frontends/pull/873) [`99ad5e9`](https://github.com/shopware/frontends/commit/99ad5e99652771ea7cd5e1395708a878cca980f5) Thanks [@mkucmus](https://github.com/mkucmus)! - Add isStackable and isDigital computed properties

- [#705](https://github.com/shopware/frontends/pull/705) [`8f0b468`](https://github.com/shopware/frontends/commit/8f0b46850a0b89667934c551431306f7d765f86b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing addressId to the `updateCustomerAddress` method

- [#524](https://github.com/shopware/frontends/pull/524) [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Added new composables (previously internal helpers of the `cms-base` package): `useCmsTranslations`, `useUrlResolver`, `useUrlResolver`

- Updated dependencies [[`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae), [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198), [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1), [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74), [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715)]:
  - @shopware/api-client@1.0.0
  - @shopware-pwa/helpers-next@1.0.0

## 0.14.1

### Patch Changes

- [#462](https://github.com/shopware/frontends/pull/462) [`c3aa09ee`](https://github.com/shopware/frontends/commit/c3aa09ee9e73c23b79bf9c1b3e5e63d7d39f1550) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@vueuse/core_ from **^10.5.0** to **^10.6.1**

- [#467](https://github.com/shopware/frontends/pull/467) [`0e031efe`](https://github.com/shopware/frontends/commit/0e031efe7a3c0249a5e883c85ec87542ab07a4c0) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _scule_ from **^1.0.0** to **^1.1.0**

- Updated dependencies [[`729d03a5`](https://github.com/shopware/frontends/commit/729d03a5d5555a67d420cdb0c89a0cb4ce907831)]:
  - @shopware-pwa/helpers-next@0.5.1
  - @shopware-pwa/api-client@0.7.0

## 0.14.0

### Minor Changes

- [#453](https://github.com/shopware/frontends/pull/453) [`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add category advanced search method

- [#445](https://github.com/shopware/frontends/pull/445) [`c264bf5d`](https://github.com/shopware/frontends/commit/c264bf5d41638c6013ebf14e7cd9615e5b5ef9bf) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Adding the missing srcset attribute to the image tag in the CmsElementImage component. as well as adding support for HTML video elements as in Shopware management, it is possible for users to associate videos to any Cms image element.

- [#444](https://github.com/shopware/frontends/pull/444) [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Use `relativeUrlSlash` toggle helper for element img url attribute

- [#431](https://github.com/shopware/frontends/pull/431) [`87213fb0`](https://github.com/shopware/frontends/commit/87213fb02b292b11f45b7fb5956fb8bc1ae33800) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add tests for `useProductAssociations`, `useProductConfigurator`, `useProductPrice`

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Changed types imports to `import type {...} from "..."`

### Patch Changes

- [#418](https://github.com/shopware/frontends/pull/418) [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@vueuse/core_ from **^10.4.1** to **^10.5.0**

- [#409](https://github.com/shopware/frontends/pull/409) [`12ed75ff`](https://github.com/shopware/frontends/commit/12ed75ffd3d98bf2623161e44f63c40dfc1ef0e3) Thanks [@mkucmus](https://github.com/mkucmus)! - Correct active addresses location for current context

- [#433](https://github.com/shopware/frontends/pull/433) [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - `changeProductQuantity` returns whole cart response

- Updated dependencies [[`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0), [`29f849d2`](https://github.com/shopware/frontends/commit/29f849d28c0d0ff8fc34f0d5e921ac2828c93f2b), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303)]:
  - @shopware-pwa/api-client@0.7.0
  - @shopware-pwa/helpers-next@0.5.0

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
