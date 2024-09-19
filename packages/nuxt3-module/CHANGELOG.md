# @shopware-pwa/nuxt3-module

## 1.0.5

### Patch Changes

- [#1207](https://github.com/shopware/frontends/pull/1207) [`7531874`](https://github.com/shopware/frontends/commit/75318747536b3cad5b83804a730b6680deb3fc8d) Thanks [@mkucmus](https://github.com/mkucmus)! - Improvements within a nuxt module and the plugin:

  - properly loading a `sw-context-token` cookie in SSR
  - exposing an [API client](https://www.npmjs.com/package/@shopware/api-client) instance provided in a nuxt plugin
  - adds corresponding types

  ```ts
  // works also in a route middleware
  const { $shopwareApiClient } = useNuxtApp();

  await $shopwareApiClient.invoke("readContext get /context");
  ```

- Updated dependencies [[`6ee2f90`](https://github.com/shopware/frontends/commit/6ee2f90ca3b21730fa05e1120072ac4dd45aa665), [`6ee2f90`](https://github.com/shopware/frontends/commit/6ee2f90ca3b21730fa05e1120072ac4dd45aa665)]:
  - @shopware-pwa/composables-next@1.3.0
  - @shopware-pwa/helpers-next@1.1.0

## 1.0.4

### Patch Changes

- Updated dependencies [[`2e4c887`](https://github.com/shopware/frontends/commit/2e4c8872060fb2ebabe5b89d92761994a2ed8128), [`aa8f5a4`](https://github.com/shopware/frontends/commit/aa8f5a4d2eabce1d6119e31af8c7479911d7b07b)]:
  - @shopware-pwa/helpers-next@1.0.2
  - @shopware-pwa/composables-next@1.2.0

## 1.0.3

### Patch Changes

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Migrate eslint config to flat format

- Updated dependencies [[`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4), [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4), [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6), [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4), [`3bde5fe`](https://github.com/shopware/frontends/commit/3bde5fe6d4a9c31d380defc05a7903cf99cb8136)]:
  - @shopware-pwa/helpers-next@1.0.1
  - @shopware-pwa/composables-next@1.1.1
  - @shopware/api-client@1.0.2

## 1.0.2

### Patch Changes

- Updated dependencies [[`f9d2735`](https://github.com/shopware/frontends/commit/f9d27353ec6383cb22cdece0469f8fdd13250958), [`d95751e`](https://github.com/shopware/frontends/commit/d95751ecde443a033f17def838bcc25aeba6951e)]:
  - @shopware-pwa/composables-next@1.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`19f2800`](https://github.com/shopware/frontends/commit/19f28003cf937bcb630257cb7cfd2bd131b7cf9d), [`1954022`](https://github.com/shopware/frontends/commit/19540220d87788eed08991d35aaaead2e18564e5), [`19f2800`](https://github.com/shopware/frontends/commit/19f28003cf937bcb630257cb7cfd2bd131b7cf9d)]:
  - @shopware/api-client@1.0.1
  - @shopware-pwa/composables-next@1.0.1

## 1.0.0

### Major Changes

- [#871](https://github.com/shopware/frontends/pull/871) [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198) Thanks [@patzick](https://github.com/patzick)! - Read more about new major release: https://github.com/shopware/frontends/discussions/965

- [#452](https://github.com/shopware/frontends/pull/452) [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2) Thanks [@patzick](https://github.com/patzick)! - Created Nuxt layer for `composables` and `cms-base`. This way overriding any part of that is now possible.

### Patch Changes

- [#478](https://github.com/shopware/frontends/pull/478) [`df96fd0`](https://github.com/shopware/frontends/commit/df96fd09b9bef27d058e3f7ee9b4f18f7035d622) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.8.1** to **^3.8.2**

- [#742](https://github.com/shopware/frontends/pull/742) [`aa97efe`](https://github.com/shopware/frontends/commit/aa97efe0131024fb3d61cf0d8df6c44eccc62e70) Thanks [@mkucmus](https://github.com/mkucmus)! - Use new format of module config & deprecation warning for old config format

- [#664](https://github.com/shopware/frontends/pull/664) [`af2bc19`](https://github.com/shopware/frontends/commit/af2bc19063d967bd1d13b388ddf430d97ae8445a) Thanks [@rebewp](https://github.com/rebewp)! - Changed usage of env variables to be able to adjust their naming to only include shopware once.
  After merging, ENV Variables with names including _*SHOPWARE_SHOPWARE*_ still work.
- Updated dependencies [[`38a3853`](https://github.com/shopware/frontends/commit/38a385374a99d114c4ed3477f14c9e06dedb0dcd), [`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae), [`f1b2a30`](https://github.com/shopware/frontends/commit/f1b2a307de58e0f296edab3222b7cd5684104347), [`2ade07a`](https://github.com/shopware/frontends/commit/2ade07ad51944eebb7d1962c36823875cd5e959e), [`fc262dd`](https://github.com/shopware/frontends/commit/fc262dd3a93338353394c03faf7fee36a0c36511), [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198), [`823aa9b`](https://github.com/shopware/frontends/commit/823aa9b4626c8931d2bea1399e825162c44fd45c), [`4dce006`](https://github.com/shopware/frontends/commit/4dce006460611e59fed084511ca9ecb814f95cf1), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`bebae42`](https://github.com/shopware/frontends/commit/bebae42e58e3dd47f13bf166b0fb0d8ac9a416e3), [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1), [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a), [`013a1d6`](https://github.com/shopware/frontends/commit/013a1d6f88377686cfc1a85903a0c48d8fda67f5), [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f), [`99ad5e9`](https://github.com/shopware/frontends/commit/99ad5e99652771ea7cd5e1395708a878cca980f5), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`04ac2ad`](https://github.com/shopware/frontends/commit/04ac2ada522c881bb06565c332baf5f2cf08643d), [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`8f0b468`](https://github.com/shopware/frontends/commit/8f0b46850a0b89667934c551431306f7d765f86b), [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74), [`05ca5b6`](https://github.com/shopware/frontends/commit/05ca5b68f098bc8969c2c50e270b19b00938513c), [`7a3a92c`](https://github.com/shopware/frontends/commit/7a3a92c3ee1a337e752adbcfa5057d30064eed7c), [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956), [`479357c`](https://github.com/shopware/frontends/commit/479357c74d40c99218eb22ccd4089357ffab5872), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715)]:
  - @shopware-pwa/composables-next@1.0.0
  - @shopware/api-client@1.0.0
  - @shopware-pwa/helpers-next@1.0.0

## 0.5.6

### Patch Changes

- [#458](https://github.com/shopware/frontends/pull/458) [`135ca37d`](https://github.com/shopware/frontends/commit/135ca37d9c911cf47d75705006af2879ab7800a8) Thanks [@danielroe](https://github.com/danielroe)! - This improves performance slightly when developing; we can avoid loading the entire barrel file at `#app` by using the new granular imports merged in https://github.com/nuxt/nuxt/pull/23951.

- Updated dependencies [[`c3aa09ee`](https://github.com/shopware/frontends/commit/c3aa09ee9e73c23b79bf9c1b3e5e63d7d39f1550), [`0e031efe`](https://github.com/shopware/frontends/commit/0e031efe7a3c0249a5e883c85ec87542ab07a4c0)]:
  - @shopware-pwa/composables-next@0.14.1
  - @shopware-pwa/api-client@0.7.0

## 0.5.5

### Patch Changes

- [#418](https://github.com/shopware/frontends/pull/418) [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.3** to **^3.7.4**

- [#404](https://github.com/shopware/frontends/pull/404) [`f3566759`](https://github.com/shopware/frontends/commit/f35667597b70eb719d0bcaf1c969f23216b66095) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Refactoring and sorting of used composables

- [#396](https://github.com/shopware/frontends/pull/396) [`dfc49b80`](https://github.com/shopware/frontends/commit/dfc49b80bcaa8e00b71e0dff6e35b413383274f5) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.1** to **^3.7.3**

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.4** to **^3.8.0**

- [#454](https://github.com/shopware/frontends/pull/454) [`07ef770d`](https://github.com/shopware/frontends/commit/07ef770d31b9331536ab9c846f4a8ce46e49ed84) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.8.0** to **^3.8.1**

- Updated dependencies [[`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720), [`c264bf5d`](https://github.com/shopware/frontends/commit/c264bf5d41638c6013ebf14e7cd9615e5b5ef9bf), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303), [`87213fb0`](https://github.com/shopware/frontends/commit/87213fb02b292b11f45b7fb5956fb8bc1ae33800), [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0), [`12ed75ff`](https://github.com/shopware/frontends/commit/12ed75ffd3d98bf2623161e44f63c40dfc1ef0e3), [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5)]:
  - @shopware-pwa/composables-next@0.14.0
  - @shopware-pwa/api-client@0.7.0

## 0.5.4

### Patch Changes

- [#387](https://github.com/shopware/frontends/pull/387) [`3520c261`](https://github.com/shopware/frontends/commit/3520c261129a6a785802aa14107b8b39cdd8baf4) Thanks [@mkucmus](https://github.com/mkucmus)! - Load composables explicitly within the shopware plugin

- [#385](https://github.com/shopware/frontends/pull/385) [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.5** to **^3.7.1**

- Updated dependencies [[`211ccbb2`](https://github.com/shopware/frontends/commit/211ccbb2e4d9d6009847e6ff53099deb97d569de), [`b2b6905b`](https://github.com/shopware/frontends/commit/b2b6905beb8f28b79c0989ff9340c757e60001c9), [`61de0366`](https://github.com/shopware/frontends/commit/61de03662869e9ad8b69e2d8a868313a61a7a741), [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a)]:
  - @shopware-pwa/composables-next@0.13.3
  - @shopware-pwa/api-client@0.6.0

## 0.5.3

### Patch Changes

- Updated dependencies []:
  - @shopware-pwa/composables-next@0.13.2

## 0.5.2

### Patch Changes

- Updated dependencies [[`4532b60d`](https://github.com/shopware/frontends/commit/4532b60d449e1b5a45506fafa16eb7d156dc2359)]:
  - @shopware-pwa/api-client@0.6.0
  - @shopware-pwa/composables-next@0.13.1

## 0.5.1

### Patch Changes

- Updated dependencies [[`d03228a`](https://github.com/shopware/frontends/commit/d03228a51058ec376b003e80dd0395237a12bfb6), [`3683116`](https://github.com/shopware/frontends/commit/3683116588a7ef75e750fc33deee119f038c88e8)]:
  - @shopware-pwa/composables-next@0.13.0

## 0.5.0

### Minor Changes

- [#325](https://github.com/shopware/frontends/pull/325) [`faf28ca`](https://github.com/shopware/frontends/commit/faf28ca3f150b22d567b1f9e94b75e156c5d0aaa) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add private `shopwareEndpoint` config for SSR instance creation

### Patch Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.3** to **^3.6.5**

- Updated dependencies [[`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b)]:
  - @shopware-pwa/composables-next@0.12.1
  - @shopware-pwa/api-client@0.5.2

## 0.4.0

### Minor Changes

- [#309](https://github.com/shopware/frontends/pull/309) [`84a7fe6`](https://github.com/shopware/frontends/commit/84a7fe6468041a4b12841fdf4844f3b38dfa387d) Thanks [@patzick](https://github.com/patzick)! - Added new config `useUserContextInSSR` - set to true if you want for the server to use session from cookie and prepare view with it. Use carefully with edge caching to avoid sharing user data with edge cache. Default is false, so server will always use new context to prepare rendered view.

### Patch Changes

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

- [#313](https://github.com/shopware/frontends/pull/313) [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.1** to **^3.6.2**

- [#328](https://github.com/shopware/frontends/pull/328) [`a75617f`](https://github.com/shopware/frontends/commit/a75617f4104f7e66599aa5341e46759bb9d414c9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.2** to **^3.6.3**

- Updated dependencies [[`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d), [`8c6ff0a`](https://github.com/shopware/frontends/commit/8c6ff0ac87143a014f609aedd22aac99888da337), [`b9a2004`](https://github.com/shopware/frontends/commit/b9a20044d3df04370c62ab392b5144a62fbb57a9)]:
  - @shopware-pwa/composables-next@0.12.0
  - @shopware-pwa/api-client@0.5.2

## 0.3.7

### Patch Changes

- [#295](https://github.com/shopware/frontends/pull/295) [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`e6a52ec`](https://github.com/shopware/frontends/commit/e6a52ec4b7c28627c55cbd8ca15b8458cedf53bd), [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49), [`bb48e13`](https://github.com/shopware/frontends/commit/bb48e131570a2db4b7431c842e54ad67d9384cd5), [`14d97c5`](https://github.com/shopware/frontends/commit/14d97c5942adf5a49163625b2740d95bc5772689)]:
  - @shopware-pwa/composables-next@0.11.0
  - @shopware-pwa/api-client@0.5.1

## 0.3.6

### Patch Changes

- Updated dependencies [[`558c9d0`](https://github.com/shopware/frontends/commit/558c9d0f2127776a0542e8d1d95734cb5d4c7e75)]:
  - @shopware-pwa/composables-next@0.10.0

## 0.3.5

### Patch Changes

- [#243](https://github.com/shopware/frontends/pull/243) [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`b9881b8`](https://github.com/shopware/frontends/commit/b9881b89da2605a5ccd78617d3f8ae8e05e8c43a), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`e359aa2`](https://github.com/shopware/frontends/commit/e359aa28c9c9c7fb2521be3ebd5b847c855e4d24), [`55db3a6`](https://github.com/shopware/frontends/commit/55db3a695ee6638f33f836890dad65742ddccf94), [`3ffd000`](https://github.com/shopware/frontends/commit/3ffd000195be60da9fbb3b41cd39fb9f4ab6167e), [`b294182`](https://github.com/shopware/frontends/commit/b294182dbc9cda82a6d2b3c13663799a9f874c66), [`8a561b9`](https://github.com/shopware/frontends/commit/8a561b9aa12b50a816203c387417c2108761dcf9), [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb)]:
  - @shopware-pwa/composables-next@0.9.0
  - @shopware-pwa/api-client@0.5.0

## 0.3.4

### Patch Changes

- Types for `devStorefrontUrl`

- Updated dependencies [[`0242a3ad`](https://github.com/shopware/frontends/commit/0242a3adcde82e301f2e53fb562c0bbd767c04f9)]:
  - @shopware-pwa/composables-next@0.8.2

## 0.3.3

### Patch Changes

- updated changelog in readme

- Updated dependencies []:
  - @shopware-pwa/composables-next@0.8.1
  - @shopware-pwa/api-client@0.4.1

## 0.3.2

### Patch Changes

- [#172](https://github.com/shopware/frontends/pull/172) [`4b323a14`](https://github.com/shopware/frontends/commit/4b323a14f3cb7b8c76f53133e43a64fc56d27c3a) Thanks [@patzick](https://github.com/patzick)! - Proper SSR context for requests. Logged in client have hydrated data on reload.

- [#204](https://github.com/shopware/frontends/pull/204) [`ed35e37d`](https://github.com/shopware/frontends/commit/ed35e37dbedf43aef3ab34dde54230e912f8fa35) Thanks [@mkucmus](https://github.com/mkucmus)! - Package.json parser removed

- [#200](https://github.com/shopware/frontends/pull/200) [`329b0aec`](https://github.com/shopware/frontends/commit/329b0aec74c85683f4b69c3cc94ef398f797cf8b) Thanks [@mkucmus](https://github.com/mkucmus)! - Internal dependency resolving

- Updated dependencies [[`0e85ad14`](https://github.com/shopware/frontends/commit/0e85ad14c7a115a9e4e79cb3d89e41129be30f03), [`3764736e`](https://github.com/shopware/frontends/commit/3764736e52fffb7f7abeb4c044dee2adc812cbb6), [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b), [`e03c67a8`](https://github.com/shopware/frontends/commit/e03c67a8d553694be6e14e2c8d1a3f99b1b2ffbe), [`1fd1962f`](https://github.com/shopware/frontends/commit/1fd1962f7f4ee26461e8918e70e5f686fa431c6d), [`bb64070f`](https://github.com/shopware/frontends/commit/bb64070f69e47c14653c524d864f7a8ab8290724), [`693f9829`](https://github.com/shopware/frontends/commit/693f9829d5082307cb1f3b18d5b0217e42c6cf68), [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57), [`8dc64e31`](https://github.com/shopware/frontends/commit/8dc64e31756e8509866efdc2b52915b8862598cb), [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57), [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b), [`0188b36a`](https://github.com/shopware/frontends/commit/0188b36acdf43278163a2fee74ff5b1c1aba55d8)]:
  - @shopware-pwa/composables-next@0.8.0
  - @shopware-pwa/api-client@0.4.0

## 0.3.1

### Patch Changes

- Updated dependencies []:
  - @shopware-pwa/composables-next@0.7.1
  - @shopware-pwa/api-client@0.3.1

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
