# @shopware-pwa/composables-next

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
