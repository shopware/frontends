# @shopware-pwa/nuxt3-module

## 0.3.0

### Minor Changes

- [#71](https://github.com/shopware/frontends/pull/71) [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067) Thanks [@patzick](https://github.com/patzick)! - **BREAKING**: Remove default config and use Nuxt runtime config

  change your `nuxt.config.js` from:

  ```ts
  export default defineNuxtConfig({
    ///...
    shopware: {
      shopwareEndpoint: "http://localhost:8000",
      shopwareAccessToken: "your-access-token",
    },
    ///...
  });
  ```

  to

  ```ts
  export default defineNuxtConfig({
    ///...
    runtimeConfig: {
      public: {
        shopware: {
          shopwareEndpoint: "http://localhost:8000",
          shopwareAccessToken: "your-access-token",
        },
      },
    },
    ///...
  });
  ```

### Patch Changes

- [`09e49987`](https://github.com/shopware/frontends/commit/09e499877efe6f7ccccf6fc166a07d806a68a136) Thanks [@mkucmus](https://github.com/mkucmus)! - Correct languageId access on config change

- [#79](https://github.com/shopware/frontends/pull/79) [`b2fde982`](https://github.com/shopware/frontends/commit/b2fde98223ad49a791d01803349ee5664743c714) Thanks [@patzick](https://github.com/patzick)! - upgraded Nuxt to 3.3.2

- [`aff245cb`](https://github.com/shopware/frontends/commit/aff245cb43ac2b69772ffd08e3250c52decf31f4) Thanks [@elkmod](https://github.com/elkmod)! - Added devtools integration to nuxt-module

- Updated dependencies [[`50e74be5`](https://github.com/shopware/frontends/commit/50e74be52034d1947e273985f778e986f077db44), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`d358854c`](https://github.com/shopware/frontends/commit/d358854c632447228e719efdf639c428cf6ba804), [`dab0f839`](https://github.com/shopware/frontends/commit/dab0f839eeebe6bb9999cdd0ec11925d935b08b9), [`ec030631`](https://github.com/shopware/frontends/commit/ec0306312fa42451f5f4a98c3e8985b70496fd37), [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`30493417`](https://github.com/shopware/frontends/commit/30493417ad5b97ee1f0553f68357a23446b85522), [`e13d3d9a`](https://github.com/shopware/frontends/commit/e13d3d9adde759e97ca7fa9b7a782b7991428679), [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067)]:
  - @shopware-pwa/composables-next@0.7.0
  - @shopware-pwa/api-client@0.3.0

## 0.2.1

### Patch Changes

- [`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f), [`313e0810`](https://github.com/shopware/frontends/commit/313e0810014611a0429b76b51747536630f24627)]:
  - @shopware-pwa/composables-next@0.6.0
  - @shopware-pwa/api-client@0.2.3

## 0.2.0

### Minor Changes

- [`c300b89b`](https://github.com/shopware/frontends/commit/c300b89b80cf3476e8023db1796cec972db519f8) Thanks [@patzick](https://github.com/patzick)! - Changed `useCart` in now a shared composable, so there is only one instance.

### Patch Changes

- [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4) Thanks [@patzick](https://github.com/patzick)! - start deploying canary versions

- [`39d2d11c`](https://github.com/shopware/frontends/commit/39d2d11c922f5de9eb5d5c25225b6b93edd8ebcb) Thanks [@mkucmus](https://github.com/mkucmus)! - Payment related processes and documentation

- Updated dependencies [[`57d720ab`](https://github.com/shopware/frontends/commit/57d720ab6c8f605de605dbbe9de53d4ce43347e5), [`29deb04f`](https://github.com/shopware/frontends/commit/29deb04fd1a871cb28f1fe3af3c007ae21de999f), [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4), [`0a8f4ea1`](https://github.com/shopware/frontends/commit/0a8f4ea1a95cd684178ae412687575bf735894a7), [`4d5b04b5`](https://github.com/shopware/frontends/commit/4d5b04b5fa09910b0c02bc59b33534772da66eeb), [`77a0bbcd`](https://github.com/shopware/frontends/commit/77a0bbcd8a5ce830219e2c04c0c99d08e6c4f4f2), [`c300b89b`](https://github.com/shopware/frontends/commit/c300b89b80cf3476e8023db1796cec972db519f8), [`0855add8`](https://github.com/shopware/frontends/commit/0855add83ca04e816caed65a0538c1dbf624bb0d), [`39d2d11c`](https://github.com/shopware/frontends/commit/39d2d11c922f5de9eb5d5c25225b6b93edd8ebcb), [`4fc1cd83`](https://github.com/shopware/frontends/commit/4fc1cd833a9ebca73536b2be45cfec35f6a27dfc), [`f364da48`](https://github.com/shopware/frontends/commit/f364da4881b2c172947e394fcd8e23ddc3689a51), [`21d8331a`](https://github.com/shopware/frontends/commit/21d8331aff13cef7ed041c60376504b2f324c1f5)]:
  - @shopware-pwa/composables-next@0.5.0
  - @shopware-pwa/api-client@0.2.2

## 0.1.24

### Patch Changes

- [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb) Thanks [@patzick](https://github.com/patzick)! - `swSessionContext` available also in Nuxt `useState`

- Updated dependencies [[`7310ca6`](https://github.com/shopware/frontends/commit/7310ca64506ca5418d3ec2ef80f5c7d0fe4b779c), [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb)]:
  - @shopware-pwa/composables-next@0.4.0
  - @shopware-pwa/api-client@0.2.1

## 0.1.23

### Patch Changes

- [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`b3f711c`](https://github.com/shopware/frontends/commit/b3f711ccb230025c0567b0a06a292bf9255a4992), [`9cd4078`](https://github.com/shopware/frontends/commit/9cd4078433c5644d2153a8a1212b9076a8d37347), [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953), [`c0b9cc3`](https://github.com/shopware/frontends/commit/c0b9cc35fdb588ef5e580dc7e19fa4414ba64d04)]:
  - @shopware-pwa/api-client@0.2.0
  - @shopware-pwa/composables-next@0.3.0

## 0.1.22

### Patch Changes

- Updated dependencies []:
  - @shopware-pwa/composables-next@0.2.1

## 0.1.21

### Patch Changes

- Updated dependencies [[`16ee1d5`](https://github.com/shopware/frontends/commit/16ee1d52f76dc62ac5931dfd2ef0c428096db960)]:
  - @shopware-pwa/composables-next@0.2.0

## 0.1.20

### Patch Changes

- fa7e48f: Added changelog and readme file
- Updated dependencies [fa7e48f]
  - @shopware-pwa/api-client@0.1.20
  - @shopware-pwa/composables-next@0.1.20
