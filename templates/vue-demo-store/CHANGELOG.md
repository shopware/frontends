# vue-demo-store

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
