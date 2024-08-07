# @shopware-pwa/helpers-next

## 1.0.2

### Patch Changes

- [#1191](https://github.com/shopware/frontends/pull/1191) [`2e4c887`](https://github.com/shopware/frontends/commit/2e4c8872060fb2ebabe5b89d92761994a2ed8128) Thanks [@mkucmus](https://github.com/mkucmus)! - Prevent from getting an incorrect srcset format when img url is not set.

  before when there were no urls for 400w and 800w:
  `src="image1.jpg 100w, 400w, 800w"`

  now only the entry with an URL defined is returned

## 1.0.1

### Patch Changes

- [#1074](https://github.com/shopware/frontends/pull/1074) [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4) Thanks [@mkucmus](https://github.com/mkucmus)! - Removed optional chaining for translated properties. Expecting a different argument type for the `getLanguageName` and `getShippingMethodDeliveryTime` methods.

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Migrate eslint config to flat format

## 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#1056](https://github.com/shopware/frontends/pull/1056) [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04) Thanks [@patzick](https://github.com/patzick)! - Removed deprecations from the package:

  - `getProductThumbnailUrl` is removed. Use `getSmallestThumbnailUrl` instead.
  - internal method `_debounce` is removed.
  - internal method `_parseUrlQuery` is removed.

### Minor Changes

- [#857](https://github.com/shopware/frontends/pull/857) [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add isMaintenanceMode to check if backend is available

- [#508](https://github.com/shopware/frontends/pull/508) [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `accessGranted` property for the getMedia helper

- [#477](https://github.com/shopware/frontends/pull/477) [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Remove "@shopware-pwa/types" dependency and replace it with generic types

- [#582](https://github.com/shopware/frontends/pull/582) [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Export css classes as a separate file

- [#545](https://github.com/shopware/frontends/pull/545) [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956) Thanks [@itscark](https://github.com/itscark)! - Fix visibility classes

### Patch Changes

- [#524](https://github.com/shopware/frontends/pull/524) [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - added `buildUrlPrefix`, which perviously was internal helper of the `@shopware/cms-base` package

## 0.5.1

### Patch Changes

- [#460](https://github.com/shopware/frontends/pull/460) [`729d03a5`](https://github.com/shopware/frontends/commit/729d03a5d5555a67d420cdb0c89a0cb4ce907831) Thanks [@mkucmus](https://github.com/mkucmus)! - Proper visibility and css classes merging

- Updated dependencies []:
  - @shopware-pwa/types@0.6.0

## 0.5.0

### Minor Changes

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Changed types imports to `import type {...} from "..."`

- [#444](https://github.com/shopware/frontends/pull/444) [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add `relativeUrlSlash` and `urlIsAbsolute` helpers

### Patch Changes

- [#415](https://github.com/shopware/frontends/pull/415) [`29f849d2`](https://github.com/shopware/frontends/commit/29f849d28c0d0ff8fc34f0d5e921ac2828c93f2b) Thanks [@mkucmus](https://github.com/mkucmus)! - Add leading slash for internal category links

- Updated dependencies [[`2e80139c`](https://github.com/shopware/frontends/commit/2e80139c6fa0bace77d385cfaffa30c4811f8831), [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5)]:
  - @shopware-pwa/types@0.6.0

## 0.4.0

### Minor Changes

- [`034e032`](https://github.com/shopware/frontends/commit/034e032270134cb51bb3da940d4b766d5866b1dd) Thanks [@patzick](https://github.com/patzick)! - reduce background images size by adding `getBackgroundImageUrl` helper

## 0.3.2

### Patch Changes

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

- Updated dependencies [[`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d)]:
  - @shopware-pwa/types@0.5.6

## 0.3.1

### Patch Changes

- Updated dependencies [[`8a94e37`](https://github.com/shopware/frontends/commit/8a94e3739a24e5d748ba807852c5e5c2dfbe6cb4)]:
  - @shopware-pwa/types@0.5.5

## 0.3.0

### Minor Changes

- [#230](https://github.com/shopware/frontends/pull/230) [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add internationalization helpers with mocks data

### Patch Changes

- [#243](https://github.com/shopware/frontends/pull/243) [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`e359aa2`](https://github.com/shopware/frontends/commit/e359aa28c9c9c7fb2521be3ebd5b847c855e4d24), [`5bb88e9`](https://github.com/shopware/frontends/commit/5bb88e9f4422141de916b704f13e9ecce9b8f2f2)]:
  - @shopware-pwa/types@0.5.4

## 0.2.1

### Patch Changes

- updated changelog in readme

- Updated dependencies []:
  - @shopware-pwa/types@0.5.3

## 0.2.0

### Minor Changes

- [#194](https://github.com/shopware/frontends/pull/194) [`81f45335`](https://github.com/shopware/frontends/commit/81f4533513b2ee538111159f8e37cd7bd1db9f1e) Thanks [@niklaswolf](https://github.com/niklaswolf) and [@patzick](https://github.com/patzick)! - Added `getCategoryRoute` and `getProductRoute` helpers to create router lins with history API metadata

### Patch Changes

- Updated dependencies [[`53f81c32`](https://github.com/shopware/frontends/commit/53f81c32b50c1658ee5758820085580cceea8161), [`47221193`](https://github.com/shopware/frontends/commit/472211939db34c8c81e957bd3e91a765056c088c), [`58932a83`](https://github.com/shopware/frontends/commit/58932a83106f7c415e68c4c1555180ff844ec151), [`a1edcd18`](https://github.com/shopware/frontends/commit/a1edcd18f3665b9ecdc32f7d33902d9c394b4fb6), [`a367dba6`](https://github.com/shopware/frontends/commit/a367dba68ab73f9ed2213236c696718c222565bc)]:
  - @shopware-pwa/types@0.5.2

## 0.1.26

### Patch Changes

- fixed published packages readme

- Updated dependencies []:
  - @shopware-pwa/types@0.5.1

## 0.1.25

### Patch Changes

- [`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2) Thanks [@mkucmus](https://github.com/mkucmus)! - Methods for media extracting

- [`5008dcbf`](https://github.com/shopware/frontends/commit/5008dcbf065fc54a3f51517460e409556f370adf) Thanks [@mkucmus](https://github.com/mkucmus)! - Adds Visibility by device feature for section and block (CMS)

- [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b) Thanks [@mkucmus](https://github.com/mkucmus)! - JS-Doc improvements

- [#86](https://github.com/shopware/frontends/pull/86) [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72) Thanks [@mkucmus](https://github.com/mkucmus)! - Use technical URL as a fallback for navigation link

- [`a15a3083`](https://github.com/shopware/frontends/commit/a15a308359497bb9d483bebe040d717114946ff0) Thanks [@mkucmus](https://github.com/mkucmus)! - Proper access for an URL of main product image

- Updated dependencies [[`5008dcbf`](https://github.com/shopware/frontends/commit/5008dcbf065fc54a3f51517460e409556f370adf), [`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2), [`9c7a0f28`](https://github.com/shopware/frontends/commit/9c7a0f280c20ccbafca0e3063533820e21050bee), [`3a90d299`](https://github.com/shopware/frontends/commit/3a90d299279b451e391a946dafecc857fe1f67fc), [`2f64a718`](https://github.com/shopware/frontends/commit/2f64a71824594ffcc4e5d59f8d5e30cd627893db), [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72), [`a15a3083`](https://github.com/shopware/frontends/commit/a15a308359497bb9d483bebe040d717114946ff0), [`d358854c`](https://github.com/shopware/frontends/commit/d358854c632447228e719efdf639c428cf6ba804)]:
  - @shopware-pwa/types@0.5.0

## 0.1.24

### Patch Changes

- [`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`244d0dca`](https://github.com/shopware/frontends/commit/244d0dcaadf2435e1895675e373c608631e94566)]:
  - @shopware-pwa/types@0.4.0

## 0.1.23

### Patch Changes

- [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4) Thanks [@patzick](https://github.com/patzick)! - start deploying canary versions

- Updated dependencies [[`6c045a44`](https://github.com/shopware/frontends/commit/6c045a44242dad42571df6ce82c564e07031d373), [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4), [`39d2d11c`](https://github.com/shopware/frontends/commit/39d2d11c922f5de9eb5d5c25225b6b93edd8ebcb)]:
  - @shopware-pwa/types@0.3.0

## 0.1.22

### Patch Changes

- Updated dependencies [[`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb)]:
  - @shopware-pwa/types@0.2.0

## 0.1.21

### Patch Changes

- [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies []:
  - @shopware-pwa/types@0.1.20

## 0.1.20

### Patch Changes

- fa7e48f: Added changelog and readme file
- Updated dependencies [fa7e48f]
  - @shopware-pwa/types@0.1.20
