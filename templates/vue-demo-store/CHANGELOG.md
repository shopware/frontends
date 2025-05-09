# vue-demo-store

## 1.9.0

### Minor Changes

- [#1711](https://github.com/shopware/frontends/pull/1711) [`da3b19c`](https://github.com/shopware/frontends/commit/da3b19c741244297ba4d74a31fcffd4939e46032) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added the ability to change the account type on the account details page. email editing moved to the new tab

- [#1737](https://github.com/shopware/frontends/pull/1737) [`bd70905`](https://github.com/shopware/frontends/commit/bd70905b8443fd57d8d8cb3cfc6501a9117dea49) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Removed account payment method page

- [#1749](https://github.com/shopware/frontends/pull/1749) [`31f4a1d`](https://github.com/shopware/frontends/commit/31f4a1d169d193334871259c8911660f1028eae0) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add server routing to handle login as a customer option

### Patch Changes

- [#1858](https://github.com/shopware/frontends/pull/1858) [`331e9ef`](https://github.com/shopware/frontends/commit/331e9ef4bd73032d1a6b73e39a65e672fb3ee9d7) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove payment section from the account dashboard

- [#1812](https://github.com/shopware/frontends/pull/1812) [`c28810d`](https://github.com/shopware/frontends/commit/c28810d0ca503b97c232438e200bbf5ba5dab403) Thanks [@patzick](https://github.com/patzick)! - Fix date formatting based on locale, previously always returned en-US format

- [#1712](https://github.com/shopware/frontends/pull/1712) [`23f07df`](https://github.com/shopware/frontends/commit/23f07dff7e42c669f03a6290d0c70fd0759f9383) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Set `sw-language-id` header on the app context level

## 1.8.0

### Minor Changes

- [#1640](https://github.com/shopware/frontends/pull/1640) [`b30b046`](https://github.com/shopware/frontends/commit/b30b04646e77be86e2851c046f9dcb3a4c393042) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added possibility to edit personal info on the checkout process

### Patch Changes

- [#1685](https://github.com/shopware/frontends/pull/1685) [`7324620`](https://github.com/shopware/frontends/commit/7324620a3f39c1b62f7cc294192a3e8b8b336d09) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove `salutationId` as a required field from the forms:

  - Checkout page
  - SharedAccountAddressForm
  - CheckoutCustomerBaseInfo
  - AccountRegisterForm
  - AccountAddressForm

- [#1660](https://github.com/shopware/frontends/pull/1660) [`530b22f`](https://github.com/shopware/frontends/commit/530b22fa84eb0950c77932456f32067c596e51f6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing formatLink for links in checkout and my account page

- [#1617](https://github.com/shopware/frontends/pull/1617) [`8a57689`](https://github.com/shopware/frontends/commit/8a57689cd7f6a6c3b8ea4161d423f8b0d37a7f2c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added loader to the changing payment method on the order details page. Added better UX for the change payment method modal

## 1.7.0

### Minor Changes

- [#1602](https://github.com/shopware/frontends/pull/1602) [`bb7d1cb`](https://github.com/shopware/frontends/commit/bb7d1cbc4204ff1d48f77416f94f550bc235e5ed) Thanks [@patzick](https://github.com/patzick)! - Switch from `@shopware-pwa/helpers-next` to `@shopware/helpers` package.

- [#1602](https://github.com/shopware/frontends/pull/1602) [`bb7d1cb`](https://github.com/shopware/frontends/commit/bb7d1cbc4204ff1d48f77416f94f550bc235e5ed) Thanks [@patzick](https://github.com/patzick)! - Switch from `@shopware-pwa/cms-base` to `@shopware/cms-base-layer` package.

## 1.6.0

### Minor Changes

- [#1596](https://github.com/shopware/frontends/pull/1596) [`3a79106`](https://github.com/shopware/frontends/commit/3a791065d04152255095965e3fb12ea538a22639) Thanks [@patzick](https://github.com/patzick)! - Changed `@shopware-pwa/composables` package to `@shopware/composables`. Just rename it in package.json file and run install.

## 1.5.0

### Minor Changes

- [#1550](https://github.com/shopware/frontends/pull/1550) [`63d56b3`](https://github.com/shopware/frontends/commit/63d56b3dacd6ca48a44744e387e6212a23c8bf4a) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Removed order details from `AccountOrder` component and moved it to the new order details page `pages/account/order/details/[id].vue`

### Patch Changes

- [#1580](https://github.com/shopware/frontends/pull/1580) [`a04aa8c`](https://github.com/shopware/frontends/commit/a04aa8c0c705626bb231f8ead59c4c67a2d0d715) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Display all shipping costs in the cart components `cart.vue`, `checkout/index.vue`

## 1.4.0

### Minor Changes

- [#1506](https://github.com/shopware/frontends/pull/1506) [`0d426c2`](https://github.com/shopware/frontends/commit/0d426c28e839f8a47241e083ff09076d7136b9fb) Thanks [@patzick](https://github.com/patzick)! - Changed eslint to biome for more accurate and much faster linting experience.

- [#1490](https://github.com/shopware/frontends/pull/1490) [`c59b384`](https://github.com/shopware/frontends/commit/c59b384084a1cb70f2679ff5810518932dd06516) Thanks [@patzick](https://github.com/patzick)! - Update to the Node 22 LTS as the default

- [#1369](https://github.com/shopware/frontends/pull/1369) [`13c83be`](https://github.com/shopware/frontends/commit/13c83bec53a6aaba49941b9bf869629eadeb4515) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added dynamic breadcrumbs

- [#1489](https://github.com/shopware/frontends/pull/1489) [`2c337b5`](https://github.com/shopware/frontends/commit/2c337b5555495e5cc75f17f1c7f50cc25dfe7c1e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added a confirmation page after the double opt-in option. The confirmation link is included in the email after registration.

### Patch Changes

- [#1497](https://github.com/shopware/frontends/pull/1497) [`164cb91`](https://github.com/shopware/frontends/commit/164cb917958404a57c815e8b1cf0a0239295292c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix contrast ratio for cart and orders pages

- [#1489](https://github.com/shopware/frontends/pull/1489) [`2c337b5`](https://github.com/shopware/frontends/commit/2c337b5555495e5cc75f17f1c7f50cc25dfe7c1e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix registration form for the double opt in registration flow

- [#1404](https://github.com/shopware/frontends/pull/1404) [`d4482d5`](https://github.com/shopware/frontends/commit/d4482d51a65c435f27923e85223cac4e291f6c56) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add smooth scrolling on the routing change (excluding product variants)

## 1.3.0

### Minor Changes

- [#1329](https://github.com/shopware/frontends/pull/1329) [`68db4ba`](https://github.com/shopware/frontends/commit/68db4bad6d6283929386ea593c44c03c3d312c82) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Disable broadcasting for the vue-demo template

- [#1298](https://github.com/shopware/frontends/pull/1298) [`201a961`](https://github.com/shopware/frontends/commit/201a9611886f7e0d4381f77e9d2f1d1cb9f90802) Thanks [@patzick](https://github.com/patzick)! - Updated refs to templateRefs from Vue 3.5 for better type support

- [#1325](https://github.com/shopware/frontends/pull/1325) [`fa517bc`](https://github.com/shopware/frontends/commit/fa517bc68e33b97f6cf34205587218314cb4f5f6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Added `refreshPaymentMethod` to refresh payment methods
  - Added `refreshShippingMethod` to refresh shipping methods
  - Added check of shipping method selection on the checkout process

### Patch Changes

- [#1365](https://github.com/shopware/frontends/pull/1365) [`6abe9ab`](https://github.com/shopware/frontends/commit/6abe9abb64b9d2fe94d565393b1c08ec68b58162) Thanks [@patzick](https://github.com/patzick)! - Updated default API schema definitions to 6.6.6.0

- [#1395](https://github.com/shopware/frontends/pull/1395) [`e18a4db`](https://github.com/shopware/frontends/commit/e18a4dba8eb9fc3e8dd8deca9edaa87ee6683268) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fixed tag text contrast (accessible issue)

- [#1395](https://github.com/shopware/frontends/pull/1395) [`e18a4db`](https://github.com/shopware/frontends/commit/e18a4dba8eb9fc3e8dd8deca9edaa87ee6683268) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fixed autocomplete attribute value for inputs

  - first-name -> given-name
  - last-name -> family-name
  - password -> current-password
  - Street -> street-address
  - zipcode -> postal-code
  - city -> address-level2

- [#1396](https://github.com/shopware/frontends/pull/1396) [`94a2339`](https://github.com/shopware/frontends/commit/94a2339af69441657535f55b15b5f4c7eaebf8b5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Close minicart after route update

- [#1317](https://github.com/shopware/frontends/pull/1317) [`c18d995`](https://github.com/shopware/frontends/commit/c18d995ef210244b25353f45e3c732c546ed365e) Thanks [@khanSoliheen](https://github.com/khanSoliheen)! - Added v-if condition to show and hide AccountOrderDetails

## 1.2.0

### Minor Changes

- [#977](https://github.com/shopware/frontends/pull/977) [`ad8321f`](https://github.com/shopware/frontends/commit/ad8321fe9444d3a86a32a96ae568cfb6deb9d203) Thanks [@khanSoliheen](https://github.com/khanSoliheen)! - Link back to the product page for line items inside the cart.

- [#1215](https://github.com/shopware/frontends/pull/1215) [`6ee2f90`](https://github.com/shopware/frontends/commit/6ee2f90ca3b21730fa05e1120072ac4dd45aa665) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Added `promotions-on-cart-price-zero-error` error translation
  - Added `product-stock-reached-empty` error translation
  - Fixed add to cart notificationsz

### Patch Changes

- [#1218](https://github.com/shopware/frontends/pull/1218) [`a3de8e0`](https://github.com/shopware/frontends/commit/a3de8e06d702c4f762b8e8cd8a2f1b8e4365a4cf) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Fixed closing modal for resetting password page

- [#1223](https://github.com/shopware/frontends/pull/1223) [`4c92624`](https://github.com/shopware/frontends/commit/4c92624cee2cf24e3b00946fbecbad7e2a47bb69) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Fixed promotion-not-found error message

## 1.1.1

### Patch Changes

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Migrate eslint config to flat format

- [#1148](https://github.com/shopware/frontends/pull/1148) [`7c38102`](https://github.com/shopware/frontends/commit/7c38102be299756ac1c2dd690d9ace6044f35206) Thanks [@mkucmus](https://github.com/mkucmus)! - Change resizing mode of Shopware CDN from `crop` to `cover` mode for image of product within `SwProductCart` component

- [#1147](https://github.com/shopware/frontends/pull/1147) [`f022b44`](https://github.com/shopware/frontends/commit/f022b44a0902eae2f5a60b27068f832f07d56782) Thanks [@mkucmus](https://github.com/mkucmus)! - Use actual pagination component for wishlist and orders list within a template.
  `SwPagination` -> `SharedPagination`.

- [#1162](https://github.com/shopware/frontends/pull/1162) [`4066556`](https://github.com/shopware/frontends/commit/4066556d6cb61d098c6e7f41d66f745e6b66a234) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add data-testid for pagination

## 1.1.0

### Minor Changes

- [#893](https://github.com/shopware/frontends/pull/893) [`d95751e`](https://github.com/shopware/frontends/commit/d95751ecde443a033f17def838bcc25aeba6951e) Thanks [@khanSoliheen](https://github.com/khanSoliheen)! - Added a pagination for the order history page and wishlist page.

- [#1071](https://github.com/shopware/frontends/pull/1071) [`f9d2735`](https://github.com/shopware/frontends/commit/f9d27353ec6383cb22cdece0469f8fdd13250958) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added `Repeat order` possibility

### Patch Changes

- [#1094](https://github.com/shopware/frontends/pull/1094) [`ac62181`](https://github.com/shopware/frontends/commit/ac621814077246ba0d31ae7e0f55303868f48ed9) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Disable add to cart button when product is out of stock

## 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#1063](https://github.com/shopware/frontends/pull/1063) [`9e4df78`](https://github.com/shopware/frontends/commit/9e4df780174c4f2ca920b20aa752ae2b40e6655c) Thanks [@patzick](https://github.com/patzick)! - Updated Nuxt to `3.12.x` - this breaks layouts when two `<script` tags are inside page component. Use `defineOptions` to name your component for devtools: https://vuejs.org/api/sfc-script-setup#defineoptions otherwise Layouts might not work properly.

### Minor Changes

- [#933](https://github.com/shopware/frontends/pull/933) [`04ac2ad`](https://github.com/shopware/frontends/commit/04ac2ada522c881bb06565c332baf5f2cf08643d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Added possibility to change payment method for existing orders

- [#793](https://github.com/shopware/frontends/pull/793) [`82d465e`](https://github.com/shopware/frontends/commit/82d465e80c31fb9d2ab5fd8812576731e2500342) Thanks [@florianliebig](https://github.com/florianliebig)! - Add Account Type to register form & company name + VAT-ID fields

- [#517](https://github.com/shopware/frontends/pull/517) [`f7797e8`](https://github.com/shopware/frontends/commit/f7797e8eb8cc72d425e568f3abedeb174e703de5) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Adding all colors to uno.config.ts to show that they can changed via config.

  Changes in detail:

  - blue is now covered by primary.
  - gray and slate are now covered by secondary.
  - brand-primary is now primary (default).
  - brand-light is now light (default).
  - brand-dark is now dark (default).
  - Added also other colors to config like yellow, green, indigo and white.

- [#1047](https://github.com/shopware/frontends/pull/1047) [`ddce862`](https://github.com/shopware/frontends/commit/ddce86217ee33e77061cdc30324da7e2a4a85ac6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added closing account menu after clicking outside

- [#463](https://github.com/shopware/frontends/pull/463) [`543a8e1`](https://github.com/shopware/frontends/commit/543a8e1fb3b391a0238f329e0ead30b8322016ec) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add api error resolver for:

  - Login page
  - Account registration
  - Update product qty (cart)

  Add `useApiErrorsResolver` composable

- [#857](https://github.com/shopware/frontends/pull/857) [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add maintenance mode page

- [#917](https://github.com/shopware/frontends/pull/917) [`4beeb8b`](https://github.com/shopware/frontends/commit/4beeb8b6798b05f4c1eefafe82efe037f29b4b7f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added `markAsTopseller` badge

- [#529](https://github.com/shopware/frontends/pull/529) [`4dce006`](https://github.com/shopware/frontends/commit/4dce006460611e59fed084511ca9ecb814f95cf1) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Use product ID instead the product object in the wishlist composable

- [#897](https://github.com/shopware/frontends/pull/897) [`033867b`](https://github.com/shopware/frontends/commit/033867bd2e5ce343e2b8cc71794a95ab7b1c2923) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `localeId` as an option to change the language

- [#611](https://github.com/shopware/frontends/pull/611) [`4593318`](https://github.com/shopware/frontends/commit/459331829b0159eeafdb55564f6b2859595814b0) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add regulation price to the product card

- [#531](https://github.com/shopware/frontends/pull/531) [`f99d49c`](https://github.com/shopware/frontends/commit/f99d49c97f32cd4b0a4344a74dcf6e523f089d0b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add JSON-LD for a product page

- [#571](https://github.com/shopware/frontends/pull/571) [`67654fc`](https://github.com/shopware/frontends/commit/67654fc8ed2768892668dd42a2d367205e42cbf3) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add product review form on the product card

- [#897](https://github.com/shopware/frontends/pull/897) [`033867b`](https://github.com/shopware/frontends/commit/033867bd2e5ce343e2b8cc71794a95ab7b1c2923) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing product translations

- [#545](https://github.com/shopware/frontends/pull/545) [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956) Thanks [@itscark](https://github.com/itscark)! - Fix visibility classes

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

### Patch Changes

- [#514](https://github.com/shopware/frontends/pull/514) [`e6ea89c`](https://github.com/shopware/frontends/commit/e6ea89cf460177e43f2333870d67c8fe72874e1a) Thanks [@mkucmus](https://github.com/mkucmus)! - @nuxtjs/i18n module upgrade

- [#1028](https://github.com/shopware/frontends/pull/1028) [`6c20fd4`](https://github.com/shopware/frontends/commit/6c20fd43e9ce3c2c5ad328c51bde75ea0692e27a) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Removed duplicated search requests

  - Added `properties` as a search request parameter

- [#478](https://github.com/shopware/frontends/pull/478) [`df96fd0`](https://github.com/shopware/frontends/commit/df96fd09b9bef27d058e3f7ee9b4f18f7035d622) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.57.6** to **^0.57.7**
  - Changed dependency _vue_ from **^3.3.8** to **^3.3.9**

- [#1023](https://github.com/shopware/frontends/pull/1023) [`0027cdd`](https://github.com/shopware/frontends/commit/0027cdd2a943f141ca5b12f30fbdb210299829ed) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - - Added missing `same password` error message

  - Changed the success message block to reset after each click on the main button

- [#640](https://github.com/shopware/frontends/pull/640) [`eef5f3d`](https://github.com/shopware/frontends/commit/eef5f3d56cdaafc4da3b9f497ca83087ec97855e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Change the minimum node 18 version to 18.17.x

- [#508](https://github.com/shopware/frontends/pull/508) [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Hide digital product link if link cannot be downloaded

- [#488](https://github.com/shopware/frontends/pull/488) [`3ebe003`](https://github.com/shopware/frontends/commit/3ebe0031f0e2f41492232b4a3afed44dd41a48e8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix category external link

- [#1042](https://github.com/shopware/frontends/pull/1042) [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f) Thanks [@patzick](https://github.com/patzick)! - Completely removed dependency to the deprecated `@shopware-pwa/types` package

- [#1046](https://github.com/shopware/frontends/pull/1046) [`57d8075`](https://github.com/shopware/frontends/commit/57d8075bcb3d973414776f5d85e00ce67c6b6902) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Disable checkout button for empty cart

- [#768](https://github.com/shopware/frontends/pull/768) [`789b2b5`](https://github.com/shopware/frontends/commit/789b2b55939efef47010500ecbf614840703c284) Thanks [@mkucmus](https://github.com/mkucmus)! - Allow to provide devStorerontUrl from .env

- [#805](https://github.com/shopware/frontends/pull/805) [`815acda`](https://github.com/shopware/frontends/commit/815acdaab3f68644d5e2a71c5bc44ef9f9e5423e) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Remove ProductStatic and all related components, fix ReviewForm in demo-store

- [#873](https://github.com/shopware/frontends/pull/873) [`99ad5e9`](https://github.com/shopware/frontends/commit/99ad5e99652771ea7cd5e1395708a878cca980f5) Thanks [@mkucmus](https://github.com/mkucmus)! - Separate components for order (product, custom, discount, promotion) and cart (product, promotion) item types

- [#664](https://github.com/shopware/frontends/pull/664) [`af2bc19`](https://github.com/shopware/frontends/commit/af2bc19063d967bd1d13b388ddf430d97ae8445a) Thanks [@rebewp](https://github.com/rebewp)! - Changed usage of env variables to be able to adjust their naming to only include shopware once.
  After merging, ENV Variables with names including _*SHOPWARE_SHOPWARE*_ still work.

- [#620](https://github.com/shopware/frontends/pull/620) [`7535a51`](https://github.com/shopware/frontends/commit/7535a51562adaea4be1afc93a7b9d1e84a777b73) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Switch off telemetry

- Updated dependencies [[`38a3853`](https://github.com/shopware/frontends/commit/38a385374a99d114c4ed3477f14c9e06dedb0dcd), [`df96fd0`](https://github.com/shopware/frontends/commit/df96fd09b9bef27d058e3f7ee9b4f18f7035d622), [`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae), [`f1b2a30`](https://github.com/shopware/frontends/commit/f1b2a307de58e0f296edab3222b7cd5684104347), [`2ade07a`](https://github.com/shopware/frontends/commit/2ade07ad51944eebb7d1962c36823875cd5e959e), [`fc262dd`](https://github.com/shopware/frontends/commit/fc262dd3a93338353394c03faf7fee36a0c36511), [`df96fd0`](https://github.com/shopware/frontends/commit/df96fd09b9bef27d058e3f7ee9b4f18f7035d622), [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715), [`801420a`](https://github.com/shopware/frontends/commit/801420aedcd8f43159862dfdb31eb9240d8d7fe2), [`823aa9b`](https://github.com/shopware/frontends/commit/823aa9b4626c8931d2bea1399e825162c44fd45c), [`4dce006`](https://github.com/shopware/frontends/commit/4dce006460611e59fed084511ca9ecb814f95cf1), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`bebae42`](https://github.com/shopware/frontends/commit/bebae42e58e3dd47f13bf166b0fb0d8ac9a416e3), [`f7797e8`](https://github.com/shopware/frontends/commit/f7797e8eb8cc72d425e568f3abedeb174e703de5), [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`033867b`](https://github.com/shopware/frontends/commit/033867bd2e5ce343e2b8cc71794a95ab7b1c2923), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1), [`da77b65`](https://github.com/shopware/frontends/commit/da77b6560f1f658df4093bc332d81bf03cff957f), [`aa97efe`](https://github.com/shopware/frontends/commit/aa97efe0131024fb3d61cf0d8df6c44eccc62e70), [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a), [`3c40741`](https://github.com/shopware/frontends/commit/3c407411cf9ce7ad18df9e9647c70972da4509e0), [`013a1d6`](https://github.com/shopware/frontends/commit/013a1d6f88377686cfc1a85903a0c48d8fda67f5), [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f), [`99ad5e9`](https://github.com/shopware/frontends/commit/99ad5e99652771ea7cd5e1395708a878cca980f5), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`04ac2ad`](https://github.com/shopware/frontends/commit/04ac2ada522c881bb06565c332baf5f2cf08643d), [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`815acda`](https://github.com/shopware/frontends/commit/815acdaab3f68644d5e2a71c5bc44ef9f9e5423e), [`ead7415`](https://github.com/shopware/frontends/commit/ead74155470be9714125fa59fbf7f8e78b62e91c), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`8f0b468`](https://github.com/shopware/frontends/commit/8f0b46850a0b89667934c551431306f7d765f86b), [`f8266a0`](https://github.com/shopware/frontends/commit/f8266a0bba4f6d2195dd128e177933e6e61478ff), [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74), [`05ca5b6`](https://github.com/shopware/frontends/commit/05ca5b68f098bc8969c2c50e270b19b00938513c), [`af2bc19`](https://github.com/shopware/frontends/commit/af2bc19063d967bd1d13b388ddf430d97ae8445a), [`7a3a92c`](https://github.com/shopware/frontends/commit/7a3a92c3ee1a337e752adbcfa5057d30064eed7c), [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956), [`479357c`](https://github.com/shopware/frontends/commit/479357c74d40c99218eb22ccd4089357ffab5872), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715), [`f6b194e`](https://github.com/shopware/frontends/commit/f6b194e97f7bafb291a6c8b2397ed1412fd003e9), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715)]:
  - @shopware-pwa/composables-next@1.0.0
  - @shopware-pwa/cms-base@1.0.0
  - @shopware/api-client@1.0.0
  - @shopware-pwa/nuxt3-module@1.0.0
  - @shopware-pwa/helpers-next@1.0.0

## 0.15.1

### Patch Changes

- [#466](https://github.com/shopware/frontends/pull/466) [`543d18d5`](https://github.com/shopware/frontends/commit/543d18d5f8523162dacb364c8e8e6adcff41c0ff) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Adjust product listing page styles

- [#462](https://github.com/shopware/frontends/pull/462) [`c3aa09ee`](https://github.com/shopware/frontends/commit/c3aa09ee9e73c23b79bf9c1b3e5e63d7d39f1550) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.57.2** to **^0.57.3**
  - Changed dependency _@vueuse/nuxt_ from **^10.5.0** to **^10.6.1**

- [#467](https://github.com/shopware/frontends/pull/467) [`0e031efe`](https://github.com/shopware/frontends/commit/0e031efe7a3c0249a5e883c85ec87542ab07a4c0) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.57.3** to **^0.57.6**

- Updated dependencies [[`729d03a5`](https://github.com/shopware/frontends/commit/729d03a5d5555a67d420cdb0c89a0cb4ce907831), [`c3aa09ee`](https://github.com/shopware/frontends/commit/c3aa09ee9e73c23b79bf9c1b3e5e63d7d39f1550), [`729d03a5`](https://github.com/shopware/frontends/commit/729d03a5d5555a67d420cdb0c89a0cb4ce907831), [`135ca37d`](https://github.com/shopware/frontends/commit/135ca37d9c911cf47d75705006af2879ab7800a8), [`0e031efe`](https://github.com/shopware/frontends/commit/0e031efe7a3c0249a5e883c85ec87542ab07a4c0)]:
  - @shopware-pwa/helpers-next@0.5.1
  - @shopware-pwa/composables-next@0.14.1
  - @shopware-pwa/cms-base@0.9.1
  - @shopware-pwa/nuxt3-module@0.5.6
  - @shopware-pwa/api-client@0.7.0
  - @shopware-pwa/types@0.6.0

## 0.15.0

### Minor Changes

- [#437](https://github.com/shopware/frontends/pull/437) [`81574458`](https://github.com/shopware/frontends/commit/815744583235509d947300aafc7bb4c7193d8dc2) Thanks [@patzick](https://github.com/patzick)! - Switched default version of NodeJS to 20

- [#433](https://github.com/shopware/frontends/pull/433) [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add a new `getErrorsCodes` method for `useCartNotification` that returns cart errors without displaying it.

- [#433](https://github.com/shopware/frontends/pull/433) [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Move checkout errors translations to the Frontend side

- [#433](https://github.com/shopware/frontends/pull/433) [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Refresh items list on the checkout after qty update

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Changed types imports to `import type {...} from "..."`

- [#398](https://github.com/shopware/frontends/pull/398) [`6cae7ddc`](https://github.com/shopware/frontends/commit/6cae7ddce3d37391f62d642a154a4a6114ea06aa) Thanks [@mkucmus](https://github.com/mkucmus)! - Upgrades i18n module with a correct configuration

### Patch Changes

- [#394](https://github.com/shopware/frontends/pull/394) [`209236c3`](https://github.com/shopware/frontends/commit/209236c389942d624b8d1397ea2c9a9b35d73843) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Change product listing structure

- [#434](https://github.com/shopware/frontends/pull/434) [`1a59f5e7`](https://github.com/shopware/frontends/commit/1a59f5e7f67f0ccf2f89f7a675373551e25fd5da) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing menu translation

- [#402](https://github.com/shopware/frontends/pull/402) [`9a89f409`](https://github.com/shopware/frontends/commit/9a89f40915c08ded0aee6140b42a12a18e74627f) Thanks [@mkucmus](https://github.com/mkucmus)! - Alignment to a11y standards

- [#396](https://github.com/shopware/frontends/pull/396) [`dfc49b80`](https://github.com/shopware/frontends/commit/dfc49b80bcaa8e00b71e0dff6e35b413383274f5) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.55.7** to **^0.56.0**

- [#454](https://github.com/shopware/frontends/pull/454) [`07ef770d`](https://github.com/shopware/frontends/commit/07ef770d31b9331536ab9c846f4a8ce46e49ed84) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.56.5** to **^0.57.2**
  - Changed dependency _vue_ from **^3.3.5** to **^3.3.8**

- [#418](https://github.com/shopware/frontends/pull/418) [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.56.0** to **^0.56.5**
  - Changed dependency _@vueuse/nuxt_ from **^10.4.1** to **^10.5.0**

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _vue_ from **^3.3.4** to **^3.3.5**

- [#404](https://github.com/shopware/frontends/pull/404) [`f3566759`](https://github.com/shopware/frontends/commit/f35667597b70eb719d0bcaf1c969f23216b66095) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Update error template, add terminal output for wrong nuxt config

- Updated dependencies [[`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`07ef770d`](https://github.com/shopware/frontends/commit/07ef770d31b9331536ab9c846f4a8ce46e49ed84), [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720), [`9a89f409`](https://github.com/shopware/frontends/commit/9a89f40915c08ded0aee6140b42a12a18e74627f), [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0), [`f3566759`](https://github.com/shopware/frontends/commit/f35667597b70eb719d0bcaf1c969f23216b66095), [`dfc49b80`](https://github.com/shopware/frontends/commit/dfc49b80bcaa8e00b71e0dff6e35b413383274f5), [`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720), [`c6db572f`](https://github.com/shopware/frontends/commit/c6db572f0b041726d89c7e2e18eaed6864189f3a), [`f636e5a6`](https://github.com/shopware/frontends/commit/f636e5a648d2d13b83589b34e377f1d3fccc1cf7), [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720), [`c264bf5d`](https://github.com/shopware/frontends/commit/c264bf5d41638c6013ebf14e7cd9615e5b5ef9bf), [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303), [`87213fb0`](https://github.com/shopware/frontends/commit/87213fb02b292b11f45b7fb5956fb8bc1ae33800), [`2e80139c`](https://github.com/shopware/frontends/commit/2e80139c6fa0bace77d385cfaffa30c4811f8831), [`07ef770d`](https://github.com/shopware/frontends/commit/07ef770d31b9331536ab9c846f4a8ce46e49ed84), [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0), [`12ed75ff`](https://github.com/shopware/frontends/commit/12ed75ffd3d98bf2623161e44f63c40dfc1ef0e3), [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5), [`f3be470b`](https://github.com/shopware/frontends/commit/f3be470b42b536ba84a9ce968f440f9d6409bc19), [`29f849d2`](https://github.com/shopware/frontends/commit/29f849d28c0d0ff8fc34f0d5e921ac2828c93f2b), [`dfc49b80`](https://github.com/shopware/frontends/commit/dfc49b80bcaa8e00b71e0dff6e35b413383274f5), [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303)]:
  - @shopware-pwa/composables-next@0.14.0
  - @shopware-pwa/cms-base@0.9.0
  - @shopware-pwa/nuxt3-module@0.5.5
  - @shopware-pwa/api-client@0.7.0
  - @shopware-pwa/types@0.6.0
  - @shopware-pwa/helpers-next@0.5.0

## 0.14.1

### Patch Changes

- [#388](https://github.com/shopware/frontends/pull/388) [`b4e51d98`](https://github.com/shopware/frontends/commit/b4e51d980bccb6a6e4ca0e914c25046bc52672dd) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix global error page

- [#369](https://github.com/shopware/frontends/pull/369) [`bc7a2db2`](https://github.com/shopware/frontends/commit/bc7a2db292d67cc448a901c1b7a9b5cb7dfbcd04) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.54.1** to **^0.55.2**

- [#385](https://github.com/shopware/frontends/pull/385) [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.55.2** to **^0.55.7**
  - Changed dependency _@vuelidate/validators_ from **^2.0.3** to **^2.0.4**
  - Changed dependency _@vueuse/nuxt_ from **^10.3.0** to **^10.4.1**

- Updated dependencies [[`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a), [`211ccbb2`](https://github.com/shopware/frontends/commit/211ccbb2e4d9d6009847e6ff53099deb97d569de), [`b2b6905b`](https://github.com/shopware/frontends/commit/b2b6905beb8f28b79c0989ff9340c757e60001c9), [`3520c261`](https://github.com/shopware/frontends/commit/3520c261129a6a785802aa14107b8b39cdd8baf4), [`61de0366`](https://github.com/shopware/frontends/commit/61de03662869e9ad8b69e2d8a868313a61a7a741), [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a), [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a)]:
  - @shopware-pwa/cms-base@0.8.5
  - @shopware-pwa/composables-next@0.13.3
  - @shopware-pwa/nuxt3-module@0.5.4
  - @shopware-pwa/api-client@0.6.0
  - @shopware-pwa/helpers-next@0.4.0
  - @shopware-pwa/types@0.5.6

## 0.14.0

### Minor Changes

- [#361](https://github.com/shopware/frontends/pull/361) [`bc0d8d4`](https://github.com/shopware/frontends/commit/bc0d8d4d567b835c1c3b2a1c9124e4961276b492) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Move `LayoutBreadcrumbs` component from the layout to the lower-level components

### Patch Changes

- Updated dependencies [[`d03228a`](https://github.com/shopware/frontends/commit/d03228a51058ec376b003e80dd0395237a12bfb6), [`d03228a`](https://github.com/shopware/frontends/commit/d03228a51058ec376b003e80dd0395237a12bfb6), [`3683116`](https://github.com/shopware/frontends/commit/3683116588a7ef75e750fc33deee119f038c88e8)]:
  - @shopware-pwa/cms-base@0.8.2
  - @shopware-pwa/composables-next@0.13.0
  - @shopware-pwa/nuxt3-module@0.5.1

## 0.13.0

### Minor Changes

- [#325](https://github.com/shopware/frontends/pull/325) [`faf28ca`](https://github.com/shopware/frontends/commit/faf28ca3f150b22d567b1f9e94b75e156c5d0aaa) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add private `shopwareEndpoint`

### Patch Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.53.5** to **^0.54.1**
  - Changed dependency _@vueuse/nuxt_ from **^10.2.1** to **^10.3.0**

- Updated dependencies [[`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b), [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b), [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b), [`faf28ca`](https://github.com/shopware/frontends/commit/faf28ca3f150b22d567b1f9e94b75e156c5d0aaa)]:
  - @shopware-pwa/composables-next@0.12.1
  - @shopware-pwa/nuxt3-module@0.5.0
  - @shopware-pwa/cms-base@0.8.1
  - @shopware-pwa/api-client@0.5.2
  - @shopware-pwa/helpers-next@0.3.2
  - @shopware-pwa/types@0.5.6

## 0.12.0

### Minor Changes

- [#309](https://github.com/shopware/frontends/pull/309) [`84a7fe6`](https://github.com/shopware/frontends/commit/84a7fe6468041a4b12841fdf4844f3b38dfa387d) Thanks [@patzick](https://github.com/patzick)! - Session data are no longer rendered on server. Improved edge caching to achieve better performence.

- [#309](https://github.com/shopware/frontends/pull/309) [`84a7fe6`](https://github.com/shopware/frontends/commit/84a7fe6468041a4b12841fdf4844f3b38dfa387d) Thanks [@patzick](https://github.com/patzick)! - Images are now lazy loaded, saves data on initial page load

- [#301](https://github.com/shopware/frontends/pull/301) [`8d44bbd`](https://github.com/shopware/frontends/commit/8d44bbd20df9a7c63221022d1c53461db2e2b639) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Move AccountAddressForm to the shareable components folder

- [#322](https://github.com/shopware/frontends/pull/322) [`b9a2004`](https://github.com/shopware/frontends/commit/b9a20044d3df04370c62ab392b5144a62fbb57a9) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Replace `localePath` with `formatLink`

### Patch Changes

- [#297](https://github.com/shopware/frontends/pull/297) [`8c6ff0a`](https://github.com/shopware/frontends/commit/8c6ff0ac87143a014f609aedd22aac99888da337) Thanks [@mkucmus](https://github.com/mkucmus)! - Refresh addresses on address save/edit

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

- [#331](https://github.com/shopware/frontends/pull/331) [`14b0e9a`](https://github.com/shopware/frontends/commit/14b0e9af19faf4970235476744d9034f464bc0f2) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Revert `SharedCountryStateInput` component on registration page

- [#307](https://github.com/shopware/frontends/pull/307) [`b3d391b`](https://github.com/shopware/frontends/commit/b3d391b3c00230ff07c088253d8465746757c945) Thanks [@mkucmus](https://github.com/mkucmus)! - Extract lang code from accept-language header in SSR for Intl.NumberFormat purposes

- [#313](https://github.com/shopware/frontends/pull/313) [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@unocss/nuxt_ from **^0.53.4** to **^0.53.5**
  - Changed dependency _@vuelidate/core_ from **^2.0.2** to **^2.0.3**
  - Changed dependency _@vuelidate/validators_ from **^2.0.2** to **^2.0.3**

- Updated dependencies [[`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d), [`f6f4d5c`](https://github.com/shopware/frontends/commit/f6f4d5c85e800c6d2067c6acd594a8711f43eea1), [`84a7fe6`](https://github.com/shopware/frontends/commit/84a7fe6468041a4b12841fdf4844f3b38dfa387d), [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9), [`a75617f`](https://github.com/shopware/frontends/commit/a75617f4104f7e66599aa5341e46759bb9d414c9), [`84a7fe6`](https://github.com/shopware/frontends/commit/84a7fe6468041a4b12841fdf4844f3b38dfa387d), [`8c6ff0a`](https://github.com/shopware/frontends/commit/8c6ff0ac87143a014f609aedd22aac99888da337), [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9), [`b9a2004`](https://github.com/shopware/frontends/commit/b9a20044d3df04370c62ab392b5144a62fbb57a9), [`a75617f`](https://github.com/shopware/frontends/commit/a75617f4104f7e66599aa5341e46759bb9d414c9)]:
  - @shopware-pwa/nuxt3-module@0.4.0
  - @shopware-pwa/composables-next@0.12.0
  - @shopware-pwa/api-client@0.5.2
  - @shopware-pwa/cms-base@0.8.0
  - @shopware-pwa/helpers-next@0.3.2
  - @shopware-pwa/types@0.5.6

## 0.11.0

### Minor Changes

- [#270](https://github.com/shopware/frontends/pull/270) [`14d97c5`](https://github.com/shopware/frontends/commit/14d97c5942adf5a49163625b2740d95bc5772689) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add state to the address forms

- [#283](https://github.com/shopware/frontends/pull/283) [`e6a52ec`](https://github.com/shopware/frontends/commit/e6a52ec4b7c28627c55cbd8ca15b8458cedf53bd) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Moved UnoCSS config into separate file, enabled preflight for styles reset

### Patch Changes

- [#295](https://github.com/shopware/frontends/pull/295) [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- [#284](https://github.com/shopware/frontends/pull/284) [`bb48e13`](https://github.com/shopware/frontends/commit/bb48e131570a2db4b7431c842e54ad67d9384cd5) Thanks [@mkucmus](https://github.com/mkucmus)! - Set default locale from accept-language header in SSR

- [#263](https://github.com/shopware/frontends/pull/263) [`8a94e37`](https://github.com/shopware/frontends/commit/8a94e3739a24e5d748ba807852c5e5c2dfbe6cb4) Thanks [@mkucmus](https://github.com/mkucmus)! - custom registration page

- Updated dependencies [[`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49), [`8a94e37`](https://github.com/shopware/frontends/commit/8a94e3739a24e5d748ba807852c5e5c2dfbe6cb4), [`e6a52ec`](https://github.com/shopware/frontends/commit/e6a52ec4b7c28627c55cbd8ca15b8458cedf53bd)]:
  - @shopware-pwa/nuxt3-module@0.3.7
  - @shopware-pwa/cms-base@0.7.0
  - @shopware-pwa/types@0.5.5
  - @shopware-pwa/helpers-next@0.3.1

## 0.10.0

### Minor Changes

- [#281](https://github.com/shopware/frontends/pull/281) [`558c9d0`](https://github.com/shopware/frontends/commit/558c9d0f2127776a0542e8d1d95734cb5d4c7e75) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Checkout - refresh the cart after redirecting to the summary page

### Patch Changes

- Updated dependencies []:
  - @shopware-pwa/cms-base@0.6.1
  - @shopware-pwa/nuxt3-module@0.3.6

## 0.9.0

### Minor Changes

- [#241](https://github.com/shopware/frontends/pull/241) [`51007dc`](https://github.com/shopware/frontends/commit/51007dc744c9bf9d7eb7477b1ba57702b64b3db8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add payment description and logo

- [#282](https://github.com/shopware/frontends/pull/282) [`e828f0a`](https://github.com/shopware/frontends/commit/e828f0aac8f2b83ba44536b2512eaad5d2635e33) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing data-testid

- [#230](https://github.com/shopware/frontends/pull/230) [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add language switcher

- [#280](https://github.com/shopware/frontends/pull/280) [`55db3a6`](https://github.com/shopware/frontends/commit/55db3a695ee6638f33f836890dad65742ddccf94) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add error notification for add new address form

- [#212](https://github.com/shopware/frontends/pull/212) [`e359aa2`](https://github.com/shopware/frontends/commit/e359aa28c9c9c7fb2521be3ebd5b847c855e4d24) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Display delivery time on the checkout page

### Patch Changes

- [#231](https://github.com/shopware/frontends/pull/231) [`24acfb9`](https://github.com/shopware/frontends/commit/24acfb9e78df57313060784238356a7787a264a2) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - fix getDocument date type

- [#238](https://github.com/shopware/frontends/pull/238) [`0a44331`](https://github.com/shopware/frontends/commit/0a44331b55d805e87913ae935e7d9e2505fff2da) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove ref from the menu element (temporary)

- [#271](https://github.com/shopware/frontends/pull/271) [`b9881b8`](https://github.com/shopware/frontends/commit/b9881b89da2605a5ccd78617d3f8ae8e05e8c43a) Thanks [@mkucmus](https://github.com/mkucmus)! - Allow to edit addresses on the checkout for guests

- [#274](https://github.com/shopware/frontends/pull/274) [`96d1290`](https://github.com/shopware/frontends/commit/96d12900e37a80d583ca003c4420b4f019652227) Thanks [@mkucmus](https://github.com/mkucmus)! - Redirect to the corresponding URL on variant change in PDP

- [#243](https://github.com/shopware/frontends/pull/243) [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`e359aa2`](https://github.com/shopware/frontends/commit/e359aa28c9c9c7fb2521be3ebd5b847c855e4d24), [`5bb88e9`](https://github.com/shopware/frontends/commit/5bb88e9f4422141de916b704f13e9ecce9b8f2f2), [`96d1290`](https://github.com/shopware/frontends/commit/96d12900e37a80d583ca003c4420b4f019652227), [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb)]:
  - @shopware-pwa/helpers-next@0.3.0
  - @shopware-pwa/types@0.5.4
  - @shopware-pwa/cms-base@0.6.0
  - @shopware-pwa/nuxt3-module@0.3.5

## 0.8.0

### Minor Changes

- [#99](https://github.com/shopware/frontends/pull/99) [`4c3ec0e2`](https://github.com/shopware/frontends/commit/4c3ec0e23fe0015324574388c1b12f5930b7ad63) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix types for `ProductVariantConfigurator.vue`

- [#99](https://github.com/shopware/frontends/pull/99) [`4c3ec0e2`](https://github.com/shopware/frontends/commit/4c3ec0e23fe0015324574388c1b12f5930b7ad63) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix closing sidebar for mobile view search

- [#99](https://github.com/shopware/frontends/pull/99) [`4c3ec0e2`](https://github.com/shopware/frontends/commit/4c3ec0e23fe0015324574388c1b12f5930b7ad63) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Upgrade vue-tsc and fix type checks

### Patch Changes

- [#220](https://github.com/shopware/frontends/pull/220) [`0242a3ad`](https://github.com/shopware/frontends/commit/0242a3adcde82e301f2e53fb562c0bbd767c04f9) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix clear all items from the wishlist

- [#221](https://github.com/shopware/frontends/pull/221) [`672dbecb`](https://github.com/shopware/frontends/commit/672dbecb8ee6ffd2d0d898e9d843e492abba515e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add missing useI18n composable for ProductCard component

- Updated dependencies []:
  - @shopware-pwa/nuxt3-module@0.3.4
  - @shopware-pwa/cms-base@0.5.2

## 0.7.0

### Minor Changes

- [#95](https://github.com/shopware/frontends/pull/95) [`ef73e1f3`](https://github.com/shopware/frontends/commit/ef73e1f31e287d96a9f2c3ed9310cfc0c22556ee) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Redirect user from login and register page to account in demo-store if they are already logged in (only client side).

- [#168](https://github.com/shopware/frontends/pull/168) [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57) Thanks [@mkucmus](https://github.com/mkucmus)! - Display cart item total price instead of unit price

- [#107](https://github.com/shopware/frontends/pull/107) [`58bd8d6a`](https://github.com/shopware/frontends/commit/58bd8d6ad8dc0f35c702deb910cf05a4db9e5911) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove Nitro preset initialisation

- [#124](https://github.com/shopware/frontends/pull/124) [`8e30002d`](https://github.com/shopware/frontends/commit/8e30002d0c93cce6485e7e476386d55f755fc44b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add i18n module and translations

- [#169](https://github.com/shopware/frontends/pull/169) [`7c43afbb`](https://github.com/shopware/frontends/commit/7c43afbbac108e8943b599ab8562f3ced462234b) Thanks [@patzick](https://github.com/patzick)! - Added template composable `useModal` which `SharedModal` component refactor.
  New modal system is using Vue's Teleport feature to render modals outside of the root component and keeping component context in the modal.

- [#155](https://github.com/shopware/frontends/pull/155) [`b53ac01c`](https://github.com/shopware/frontends/commit/b53ac01c72ddff1f484ccd75cca49b1ff1d44676) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Block editing data when fetching an update - my account

- [#180](https://github.com/shopware/frontends/pull/180) [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a) Thanks [@patzick](https://github.com/patzick)! - Images for CMS elements and Product cart are now optimised for displayed size. This is decreasing weight of the whole page. Also small thumbnail of the image is shown.

- [#180](https://github.com/shopware/frontends/pull/180) [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a) Thanks [@patzick](https://github.com/patzick)! - Product Card design has changed.

- [#194](https://github.com/shopware/frontends/pull/194) [`81f45335`](https://github.com/shopware/frontends/commit/81f4533513b2ee538111159f8e37cd7bd1db9f1e) Thanks [@patzick](https://github.com/patzick)! - Updated links to use new `getCategoryRoute` and `getProductRoute`. Resolve mechanism is now omiting additional `/seo-url` api request and makes internal navigation much faster. Special thanks to [@niklaswolf](https://github.com/niklaswolf) for inspiration and cooperation on that feature!

- [#187](https://github.com/shopware/frontends/pull/187) [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add shipping methods description and icon

### Patch Changes

- [#169](https://github.com/shopware/frontends/pull/169) [`7c43afbb`](https://github.com/shopware/frontends/commit/7c43afbbac108e8943b599ab8562f3ced462234b) Thanks [@patzick](https://github.com/patzick)! - Added transitions for modals and sidemenus appearance.

- [#172](https://github.com/shopware/frontends/pull/172) [`4b323a14`](https://github.com/shopware/frontends/commit/4b323a14f3cb7b8c76f53133e43a64fc56d27c3a) Thanks [@patzick](https://github.com/patzick)! - Proper SSR context for requests. Logged in client have hydrated data on reload.

- [#143](https://github.com/shopware/frontends/pull/143) [`ffde908c`](https://github.com/shopware/frontends/commit/ffde908c4d5c0b48311f16e6da62bb0cb4f844d8) Thanks [@patzick](https://github.com/patzick)! - payment method name displayed properly in checkout

- [#200](https://github.com/shopware/frontends/pull/200) [`329b0aec`](https://github.com/shopware/frontends/commit/329b0aec74c85683f4b69c3cc94ef398f797cf8b) Thanks [@mkucmus](https://github.com/mkucmus)! - Remove unnecessary dependencies

- [#138](https://github.com/shopware/frontends/pull/138) [`62cb5b0c`](https://github.com/shopware/frontends/commit/62cb5b0c2ad568593383cf2b78510a1bab36a1be) Thanks [@mkucmus](https://github.com/mkucmus)! - Refresh token before login

- [#101](https://github.com/shopware/frontends/pull/101) [`58932a83`](https://github.com/shopware/frontends/commit/58932a83106f7c415e68c4c1555180ff844ec151) Thanks [@mkucmus](https://github.com/mkucmus)! - Show regulation price on PDP and listing

- [#108](https://github.com/shopware/frontends/pull/108) [`15c7915d`](https://github.com/shopware/frontends/commit/15c7915db1c648d030469f257fbfceed77f5dacd) Thanks [@patzick](https://github.com/patzick)! - `og:site_name` value is now by default set to page title

- Updated dependencies [[`53f81c32`](https://github.com/shopware/frontends/commit/53f81c32b50c1658ee5758820085580cceea8161), [`47221193`](https://github.com/shopware/frontends/commit/472211939db34c8c81e957bd3e91a765056c088c), [`8e30002d`](https://github.com/shopware/frontends/commit/8e30002d0c93cce6485e7e476386d55f755fc44b), [`58932a83`](https://github.com/shopware/frontends/commit/58932a83106f7c415e68c4c1555180ff844ec151), [`4b323a14`](https://github.com/shopware/frontends/commit/4b323a14f3cb7b8c76f53133e43a64fc56d27c3a), [`58932a83`](https://github.com/shopware/frontends/commit/58932a83106f7c415e68c4c1555180ff844ec151), [`6320ca6f`](https://github.com/shopware/frontends/commit/6320ca6f00771b9f7d0a736c6438ca80ae60f33f), [`a1edcd18`](https://github.com/shopware/frontends/commit/a1edcd18f3665b9ecdc32f7d33902d9c394b4fb6), [`81f45335`](https://github.com/shopware/frontends/commit/81f4533513b2ee538111159f8e37cd7bd1db9f1e), [`ed35e37d`](https://github.com/shopware/frontends/commit/ed35e37dbedf43aef3ab34dde54230e912f8fa35), [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a), [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a), [`a367dba6`](https://github.com/shopware/frontends/commit/a367dba68ab73f9ed2213236c696718c222565bc), [`329b0aec`](https://github.com/shopware/frontends/commit/329b0aec74c85683f4b69c3cc94ef398f797cf8b)]:
  - @shopware-pwa/types@0.5.2
  - @shopware-pwa/cms-base@0.5.0
  - @shopware-pwa/nuxt3-module@0.3.2
  - @shopware-pwa/helpers-next@0.2.0

## 0.6.0

### Minor Changes

- [#72](https://github.com/shopware/frontends/pull/72) [`e13d3d9a`](https://github.com/shopware/frontends/commit/e13d3d9adde759e97ca7fa9b7a782b7991428679) Thanks [@patzick](https://github.com/patzick)! - Add a confirmation instruction box to the newsletter subscription panel

- [`dab0f839`](https://github.com/shopware/frontends/commit/dab0f839eeebe6bb9999cdd0ec11925d935b08b9) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add digital product to the order history list

- [`a0ed2c8a`](https://github.com/shopware/frontends/commit/a0ed2c8ad2373e74b43d879c73f667ae829bb1f3) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add basic checkout terms and conditions

- [`240eae89`](https://github.com/shopware/frontends/commit/240eae89daf685dff1b76914d263ee08f9e44b41) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add documents to the order summary

- [#71](https://github.com/shopware/frontends/pull/71) [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067) Thanks [@patzick](https://github.com/patzick)! - Add merged sitemap

- [`da14d573`](https://github.com/shopware/frontends/commit/da14d57327ab66e022dde775ce8ce2f2fc416f3a) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add data-testid for a AccountAddressCard

- [`30493417`](https://github.com/shopware/frontends/commit/30493417ad5b97ee1f0553f68357a23446b85522) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Hide the shipping address and shipping method for a digital cart (checkout, success page)

### Patch Changes

- [`e951d93a`](https://github.com/shopware/frontends/commit/e951d93ae8c085cd50d6b63317b982982a77ab42) Thanks [@patzick](https://github.com/patzick)! - Replaced `RouterLink` with `NuxtLink` for prefetch performance gain

- [`6038bb1a`](https://github.com/shopware/frontends/commit/6038bb1a9d0535161bdbdfa6159ed21f729c9305) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix order status in the orders list

- [`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2) Thanks [@mkucmus](https://github.com/mkucmus)! - Use image thumbnails in specific cases

- [`7805daf4`](https://github.com/shopware/frontends/commit/7805daf4c0519e78bfa8cf1a9ae6011e75537244) Thanks [@mkucmus](https://github.com/mkucmus)! - Notification on failed action within wishlist

- [#86](https://github.com/shopware/frontends/pull/86) [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72) Thanks [@mkucmus](https://github.com/mkucmus)! - Use correct URLs and target for navigation links

- [`f394092b`](https://github.com/shopware/frontends/commit/f394092b7796c9757c41a0721a41020d9a5ab3ef) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix my account menu (mobile)

- [`e50702db`](https://github.com/shopware/frontends/commit/e50702db725086a97f182a7213eaf03c913cd870) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Checkout logout redirect and breadcrumbs style adjustments

- [`5cf30847`](https://github.com/shopware/frontends/commit/5cf308478a822c15706c2c096f4341d50b3b8af6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Checkout style adjustments

- [`42d29bb4`](https://github.com/shopware/frontends/commit/42d29bb4beb739d12c934183c83ce7e50a171576) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Replace button links with NuxtLink

- [`1fca0eae`](https://github.com/shopware/frontends/commit/1fca0eae50d9d628954f66e4401389ac5b815152) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Order details style adjustments

- [#79](https://github.com/shopware/frontends/pull/79) [`b2fde982`](https://github.com/shopware/frontends/commit/b2fde98223ad49a791d01803349ee5664743c714) Thanks [@patzick](https://github.com/patzick)! - upgraded Nuxt to 3.3.2

- [#90](https://github.com/shopware/frontends/pull/90) [`d394ca0c`](https://github.com/shopware/frontends/commit/d394ca0cade39e40102f5e67995cc60b73e8a8a1) Thanks [@mkucmus](https://github.com/mkucmus)! - Production build example for node-ssr and docker env

- [`aff245cb`](https://github.com/shopware/frontends/commit/aff245cb43ac2b69772ffd08e3250c52decf31f4) Thanks [@elkmod](https://github.com/elkmod)! - Added devtools integration to nuxt-module

- Updated dependencies [[`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2), [`9c7a0f28`](https://github.com/shopware/frontends/commit/9c7a0f280c20ccbafca0e3063533820e21050bee), [`09e49987`](https://github.com/shopware/frontends/commit/09e499877efe6f7ccccf6fc166a07d806a68a136), [`5008dcbf`](https://github.com/shopware/frontends/commit/5008dcbf065fc54a3f51517460e409556f370adf), [`7805daf4`](https://github.com/shopware/frontends/commit/7805daf4c0519e78bfa8cf1a9ae6011e75537244), [`50e74be5`](https://github.com/shopware/frontends/commit/50e74be52034d1947e273985f778e986f077db44), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`d358854c`](https://github.com/shopware/frontends/commit/d358854c632447228e719efdf639c428cf6ba804), [`dab0f839`](https://github.com/shopware/frontends/commit/dab0f839eeebe6bb9999cdd0ec11925d935b08b9), [`e50702db`](https://github.com/shopware/frontends/commit/e50702db725086a97f182a7213eaf03c913cd870), [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067), [`ec030631`](https://github.com/shopware/frontends/commit/ec0306312fa42451f5f4a98c3e8985b70496fd37), [`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2), [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99), [`e54e494a`](https://github.com/shopware/frontends/commit/e54e494aefa4d9418c0daf7e3b805b3b17d18c15), [`9c7a0f28`](https://github.com/shopware/frontends/commit/9c7a0f280c20ccbafca0e3063533820e21050bee), [`3a90d299`](https://github.com/shopware/frontends/commit/3a90d299279b451e391a946dafecc857fe1f67fc), [`2f64a718`](https://github.com/shopware/frontends/commit/2f64a71824594ffcc4e5d59f8d5e30cd627893db), [`5008dcbf`](https://github.com/shopware/frontends/commit/5008dcbf065fc54a3f51517460e409556f370adf), [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99), [`b2fde982`](https://github.com/shopware/frontends/commit/b2fde98223ad49a791d01803349ee5664743c714), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`30493417`](https://github.com/shopware/frontends/commit/30493417ad5b97ee1f0553f68357a23446b85522), [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72), [`a15a3083`](https://github.com/shopware/frontends/commit/a15a308359497bb9d483bebe040d717114946ff0), [`e13d3d9a`](https://github.com/shopware/frontends/commit/e13d3d9adde759e97ca7fa9b7a782b7991428679), [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72), [`aff245cb`](https://github.com/shopware/frontends/commit/aff245cb43ac2b69772ffd08e3250c52decf31f4), [`a15a3083`](https://github.com/shopware/frontends/commit/a15a308359497bb9d483bebe040d717114946ff0), [`d358854c`](https://github.com/shopware/frontends/commit/d358854c632447228e719efdf639c428cf6ba804), [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067)]:
  - @shopware-pwa/helpers-next@0.1.25
  - @shopware-pwa/cms-base@0.4.1
  - @shopware-pwa/nuxt3-module@0.3.0
  - @shopware-pwa/types@0.5.0
  - @shopware-pwa/composables-next@0.7.0
  - @shopware-pwa/api-client@0.3.0

## 0.5.0

### Minor Changes

- [`313e0810`](https://github.com/shopware/frontends/commit/313e0810014611a0429b76b51747536630f24627) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add breadcrumbs support

### Patch Changes

- [`ece79b02`](https://github.com/shopware/frontends/commit/ece79b021c25499ac9ac4d54b707f27f9e25eb68) Thanks [@patzick](https://github.com/patzick)! - Removed old `_debounce` usage, we should use `useDebounceFn` from Vueuse

- [`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- [`81b9323e`](https://github.com/shopware/frontends/commit/81b9323e8fac5401709a81dd20288b18faed7692) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Separate guest user form the logged in user on the checkout page

- Updated dependencies [[`244d0dca`](https://github.com/shopware/frontends/commit/244d0dcaadf2435e1895675e373c608631e94566), [`ece79b02`](https://github.com/shopware/frontends/commit/ece79b021c25499ac9ac4d54b707f27f9e25eb68), [`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f), [`313e0810`](https://github.com/shopware/frontends/commit/313e0810014611a0429b76b51747536630f24627), [`7aa2c640`](https://github.com/shopware/frontends/commit/7aa2c640203e24b6abb5b8fe0eff6d7b72e6b08d)]:
  - @shopware-pwa/types@0.4.0
  - @shopware-pwa/cms-base@0.4.0
  - @shopware-pwa/nuxt3-module@0.2.1
  - @shopware-pwa/composables-next@0.6.0
  - @shopware-pwa/api-client@0.2.3
  - @shopware-pwa/helpers-next@0.1.24

## 0.4.0

### Minor Changes

- [`c300b89b`](https://github.com/shopware/frontends/commit/c300b89b80cf3476e8023db1796cec972db519f8) Thanks [@patzick](https://github.com/patzick)! - Changed `useCart` in now a shared composable, so there is only one instance.

- [`0855add8`](https://github.com/shopware/frontends/commit/0855add83ca04e816caed65a0538c1dbf624bb0d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add the URL query navigation to the product listing

- [`b2e4dcad`](https://github.com/shopware/frontends/commit/b2e4dcadf822355d7ca9b485beaa5b5a54f7bf18) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add the possibility of removing address from the my account page

- [`b0291676`](https://github.com/shopware/frontends/commit/b02916767be123277f87c0e6b0feb48e7e8830c6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add page not found component

### Patch Changes

- [`2080cc40`](https://github.com/shopware/frontends/commit/2080cc401dd02f91da3061dc7b6688784f1b1b6b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Display error on the registration page if occurs

- [`31fd5c8d`](https://github.com/shopware/frontends/commit/31fd5c8d72db8f5a703d50e35855690c5e202131) Thanks [@mkucmus](https://github.com/mkucmus)! - Adds a possibility to checkout as a guest

- [`3bda2153`](https://github.com/shopware/frontends/commit/3bda2153130b32501db0a9fe8270c374afcf4682) Thanks [@niklaswolf](https://github.com/niklaswolf)! - added optional chaining in LayoutTopNavigation.vue

- [`4d5b04b5`](https://github.com/shopware/frontends/commit/4d5b04b5fa09910b0c02bc59b33534772da66eeb) Thanks [@patzick](https://github.com/patzick)! - Fixed quantity changes in sidecart

- [`39d2d11c`](https://github.com/shopware/frontends/commit/39d2d11c922f5de9eb5d5c25225b6b93edd8ebcb) Thanks [@mkucmus](https://github.com/mkucmus)! - Payment related processes and documentation

- [`887894f2`](https://github.com/shopware/frontends/commit/887894f26dd047a7254c3f7a6850f0cee008d86e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Checkout registration form adjustments

- [`c903476c`](https://github.com/shopware/frontends/commit/c903476cb16cb1eac37ac2e081c503243f6bc191) Thanks [@patzick](https://github.com/patzick)! - fixed iconify carbon set on stackblitz env

- [`63a71b7d`](https://github.com/shopware/frontends/commit/63a71b7d1171d89d36b8f61cc2672a32b6cc9d3f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix currency on the init request

- [`21d8331a`](https://github.com/shopware/frontends/commit/21d8331aff13cef7ed041c60376504b2f324c1f5) Thanks [@mkucmus](https://github.com/mkucmus)! - Move checkout-related methods to useCheckout composable

- [`deaf9d1b`](https://github.com/shopware/frontends/commit/deaf9d1b60f5b32862e6e1bbf25e1a45c5361cdc) Thanks [@benjamin-ott](https://github.com/benjamin-ott)! - use translated name property for listing filter label

- Updated dependencies [[`21acce67`](https://github.com/shopware/frontends/commit/21acce67d05a2f1fcc1441174f7b4159b0b5b5d0), [`57d720ab`](https://github.com/shopware/frontends/commit/57d720ab6c8f605de605dbbe9de53d4ce43347e5), [`6c045a44`](https://github.com/shopware/frontends/commit/6c045a44242dad42571df6ce82c564e07031d373), [`073073b6`](https://github.com/shopware/frontends/commit/073073b627a444050e969ebf33933b1a27a2fa3f), [`29deb04f`](https://github.com/shopware/frontends/commit/29deb04fd1a871cb28f1fe3af3c007ae21de999f), [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4), [`0a8f4ea1`](https://github.com/shopware/frontends/commit/0a8f4ea1a95cd684178ae412687575bf735894a7), [`4d5b04b5`](https://github.com/shopware/frontends/commit/4d5b04b5fa09910b0c02bc59b33534772da66eeb), [`77a0bbcd`](https://github.com/shopware/frontends/commit/77a0bbcd8a5ce830219e2c04c0c99d08e6c4f4f2), [`c300b89b`](https://github.com/shopware/frontends/commit/c300b89b80cf3476e8023db1796cec972db519f8), [`0855add8`](https://github.com/shopware/frontends/commit/0855add83ca04e816caed65a0538c1dbf624bb0d), [`6c045a44`](https://github.com/shopware/frontends/commit/6c045a44242dad42571df6ce82c564e07031d373), [`39d2d11c`](https://github.com/shopware/frontends/commit/39d2d11c922f5de9eb5d5c25225b6b93edd8ebcb), [`4fc1cd83`](https://github.com/shopware/frontends/commit/4fc1cd833a9ebca73536b2be45cfec35f6a27dfc), [`f364da48`](https://github.com/shopware/frontends/commit/f364da4881b2c172947e394fcd8e23ddc3689a51), [`21d8331a`](https://github.com/shopware/frontends/commit/21d8331aff13cef7ed041c60376504b2f324c1f5), [`deaf9d1b`](https://github.com/shopware/frontends/commit/deaf9d1b60f5b32862e6e1bbf25e1a45c5361cdc)]:
  - @shopware-pwa/cms-base@0.3.0
  - @shopware-pwa/composables-next@0.5.0
  - @shopware-pwa/types@0.3.0
  - @shopware-pwa/api-client@0.2.2
  - @shopware-pwa/helpers-next@0.1.23
  - @shopware-pwa/nuxt3-module@0.2.0

## 0.3.0

### Minor Changes

- [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb) Thanks [@patzick](https://github.com/patzick)! - improved session context to be better handled on SSR

- [`fed1335`](https://github.com/shopware/frontends/commit/fed1335afe8fb8054cad72c34eb79ce66be3bf05) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Moving data rendering to CSR

- [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb) Thanks [@patzick](https://github.com/patzick)! - added to template `useAuthGuard` which redirects to homepage if user is not logged in. You can adjust it to your desired behaviour.

### Patch Changes

- [`6693d2f`](https://github.com/shopware/frontends/commit/6693d2f4bf27eeaf80875f66d5700c1b113ae3fa) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix loading addresses on the checkout only when the user is logged in

- [`d37cb27`](https://github.com/shopware/frontends/commit/d37cb27626e4b9d890516649b25dd9c93a94a366) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add a dashboard link to the menu

- Updated dependencies [[`7310ca6`](https://github.com/shopware/frontends/commit/7310ca64506ca5418d3ec2ef80f5c7d0fe4b779c), [`412a3bd`](https://github.com/shopware/frontends/commit/412a3bde4a3d12b54ef3af2d9b8f030c7a605885), [`7ec2875`](https://github.com/shopware/frontends/commit/7ec2875f51e46e6b80756b848594011dd471e01e), [`412a3bd`](https://github.com/shopware/frontends/commit/412a3bde4a3d12b54ef3af2d9b8f030c7a605885), [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb), [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb), [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb)]:
  - @shopware-pwa/composables-next@0.4.0
  - @shopware-pwa/cms-base@0.2.1
  - @shopware-pwa/types@0.2.0
  - @shopware-pwa/nuxt3-module@0.1.24
  - @shopware-pwa/api-client@0.2.1
  - @shopware-pwa/helpers-next@0.1.22

## 0.2.0

### Minor Changes

- [`68b95b0`](https://github.com/shopware/frontends/commit/68b95b06f71b0e9b08da7c0936eee28311f178a8) Thanks [@mkucmus](https://github.com/mkucmus)! - listing filters hydration and top navigation submenu access

- [`c0b9cc3`](https://github.com/shopware/frontends/commit/c0b9cc35fdb588ef5e580dc7e19fa4414ba64d04) Thanks [@mkucmus](https://github.com/mkucmus)! - Price displaying strategy

- [`b3f711c`](https://github.com/shopware/frontends/commit/b3f711ccb230025c0567b0a06a292bf9255a4992) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - add dashboard to the My account page

### Patch Changes

- [`f492a6a`](https://github.com/shopware/frontends/commit/f492a6a76b0c6a9a9ad210a1993de75af82f0052) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix logout

- [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- [`802abb1`](https://github.com/shopware/frontends/commit/802abb1b47cb9b2ba1dac267c7ce42bc32dce5f8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add new data-testid attributes

- [`31a12b5`](https://github.com/shopware/frontends/commit/31a12b5259f567493fb12d8af62b2b63ada8079a) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Wishlist icon style adjustments

- Updated dependencies [[`68b95b0`](https://github.com/shopware/frontends/commit/68b95b06f71b0e9b08da7c0936eee28311f178a8), [`b3f711c`](https://github.com/shopware/frontends/commit/b3f711ccb230025c0567b0a06a292bf9255a4992), [`9cd4078`](https://github.com/shopware/frontends/commit/9cd4078433c5644d2153a8a1212b9076a8d37347), [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953), [`c0b9cc3`](https://github.com/shopware/frontends/commit/c0b9cc35fdb588ef5e580dc7e19fa4414ba64d04), [`802abb1`](https://github.com/shopware/frontends/commit/802abb1b47cb9b2ba1dac267c7ce42bc32dce5f8), [`d7da2c1`](https://github.com/shopware/frontends/commit/d7da2c11b6cbef23a83d0ffdb95d7e382795b7f3)]:
  - @shopware-pwa/cms-base@0.2.0
  - @shopware-pwa/api-client@0.2.0
  - @shopware-pwa/composables-next@0.3.0
  - @shopware-pwa/helpers-next@0.1.21
  - @shopware-pwa/nuxt3-module@0.1.23

## 0.1.1

### Patch Changes

- [`ef791ee`](https://github.com/shopware/frontends/commit/ef791eec6c6abbb9f591759676fea1f4cb66e096) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Use text compression for assets

- Updated dependencies []:
  - @shopware-pwa/composables-next@0.2.1
  - @shopware-pwa/cms-base@0.1.22
  - @shopware-pwa/nuxt3-module@0.1.22

## 0.1.0

### Minor Changes

- [`16ee1d5`](https://github.com/shopware/frontends/commit/16ee1d52f76dc62ac5931dfd2ef0c428096db960) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - set default user addresses

### Patch Changes

- Updated dependencies [[`16ee1d5`](https://github.com/shopware/frontends/commit/16ee1d52f76dc62ac5931dfd2ef0c428096db960)]:
  - @shopware-pwa/composables-next@0.2.0
  - @shopware-pwa/cms-base@0.1.21
  - @shopware-pwa/nuxt3-module@0.1.21

## 0.0.2

### Patch Changes

- Updated dependencies [fa7e48f]
  - @shopware-pwa/api-client@0.1.20
  - @shopware-pwa/composables-next@0.1.20
  - @shopware-pwa/cms-base@0.1.20
  - @shopware-pwa/helpers-next@0.1.20
  - @shopware-pwa/nuxt3-module@0.1.20
  - @shopware-pwa/types@0.1.20
