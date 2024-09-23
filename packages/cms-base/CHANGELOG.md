# @shopware-pwa/cms-base

## 1.0.5

### Patch Changes

- [#1276](https://github.com/shopware/frontends/pull/1276) [`9e734f0`](https://github.com/shopware/frontends/commit/9e734f09650c8728eaa0e1a7bb78f4cef3eabf89) Thanks [@mkucmus](https://github.com/mkucmus)! - Wrap a child vnodes into one element in CmsElementText component.
  Thanks to this, the rendered elements are in semantically correct format.
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

- [#1089](https://github.com/shopware/frontends/pull/1089) [`db7c93f`](https://github.com/shopware/frontends/commit/db7c93ff8cbb581221c11a492e77068af8faa8d6) Thanks [@mkucmus](https://github.com/mkucmus)! - Upgrade eslint config to flat format + lint

- [#1148](https://github.com/shopware/frontends/pull/1148) [`7c38102`](https://github.com/shopware/frontends/commit/7c38102be299756ac1c2dd690d9ace6044f35206) Thanks [@mkucmus](https://github.com/mkucmus)! - - Change resizing mode of Shopware CDN from `crop` to `cover` mode for image of product within `SwProductCart` component

  - Make translation for tier pricing table consistent

- [#1074](https://github.com/shopware/frontends/pull/1074) [`b688163`](https://github.com/shopware/frontends/commit/b68816391ee8ed1ac94a6462a2a016d708f259b4) Thanks [@mkucmus](https://github.com/mkucmus)! - Removed optional chaining for translated properties

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

### Minor Changes

- [#524](https://github.com/shopware/frontends/pull/524) [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Moved cms internal helper functions:

  - `buildUrlPrefix` - moved to helpers package, see `packages/helpers/src/cms/buildUrlPrefix.ts`.
  - `getCmsTranslations` - move to composables as `useCmsTranslations`
  - `getUrlPrefix` - move to composables as method in `useUrlResolver`
  - `resolveUrl` - move to composables as method in `useUrlResolver`

- [#517](https://github.com/shopware/frontends/pull/517) [`f7797e8`](https://github.com/shopware/frontends/commit/f7797e8eb8cc72d425e568f3abedeb174e703de5) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Change tailwindcss colors definition. Allows easy overwrite in demo-store template.

- [#1067](https://github.com/shopware/frontends/pull/1067) [`da77b65`](https://github.com/shopware/frontends/commit/da77b6560f1f658df4093bc332d81bf03cff957f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Changed slider element to use a static value

- [#794](https://github.com/shopware/frontends/pull/794) [`ead7415`](https://github.com/shopware/frontends/commit/ead74155470be9714125fa59fbf7f8e78b62e91c) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add media 3D models support

### Patch Changes

- [#478](https://github.com/shopware/frontends/pull/478) [`df96fd0`](https://github.com/shopware/frontends/commit/df96fd09b9bef27d058e3f7ee9b4f18f7035d622) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.8.1** to **^3.8.2**
  - Changed dependency _vue_ from **^3.3.8** to **^3.3.9**

- [#798](https://github.com/shopware/frontends/pull/798) [`801420a`](https://github.com/shopware/frontends/commit/801420aedcd8f43159862dfdb31eb9240d8d7fe2) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Blocking double click on the wishlist button

- [#897](https://github.com/shopware/frontends/pull/897) [`033867b`](https://github.com/shopware/frontends/commit/033867bd2e5ce343e2b8cc71794a95ab7b1c2923) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Make injected translations the most significant priority source

- [#609](https://github.com/shopware/frontends/pull/609) [`3c40741`](https://github.com/shopware/frontends/commit/3c407411cf9ce7ad18df9e9647c70972da4509e0) Thanks [@mkucmus](https://github.com/mkucmus)! - Use setTimeout in SwSlider once component is mounted

- [#1042](https://github.com/shopware/frontends/pull/1042) [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f) Thanks [@patzick](https://github.com/patzick)! - Completely removed dependency to the deprecated `@shopware-pwa/types` package

- [#805](https://github.com/shopware/frontends/pull/805) [`815acda`](https://github.com/shopware/frontends/commit/815acdaab3f68644d5e2a71c5bc44ef9f9e5423e) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Remove ProductStatic and all related components, fix ReviewForm in demo-store

- [#542](https://github.com/shopware/frontends/pull/542) [`f8266a0`](https://github.com/shopware/frontends/commit/f8266a0bba4f6d2195dd128e177933e6e61478ff) Thanks [@patzick](https://github.com/patzick)! - Potential problems with CmsElementText rendering, when Node object is incorrect

- [#924](https://github.com/shopware/frontends/pull/924) [`f6b194e`](https://github.com/shopware/frontends/commit/f6b194e97f7bafb291a6c8b2397ed1412fd003e9) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Moved the svg 3d media placeholder to the vue component

- Updated dependencies [[`38a3853`](https://github.com/shopware/frontends/commit/38a385374a99d114c4ed3477f14c9e06dedb0dcd), [`2343012`](https://github.com/shopware/frontends/commit/2343012ad552b06557e6715055b3abc534fa2fae), [`f1b2a30`](https://github.com/shopware/frontends/commit/f1b2a307de58e0f296edab3222b7cd5684104347), [`2ade07a`](https://github.com/shopware/frontends/commit/2ade07ad51944eebb7d1962c36823875cd5e959e), [`fc262dd`](https://github.com/shopware/frontends/commit/fc262dd3a93338353394c03faf7fee36a0c36511), [`1566f7a`](https://github.com/shopware/frontends/commit/1566f7a3962c511b5c72e12a4a5db40c4aa5d198), [`823aa9b`](https://github.com/shopware/frontends/commit/823aa9b4626c8931d2bea1399e825162c44fd45c), [`4dce006`](https://github.com/shopware/frontends/commit/4dce006460611e59fed084511ca9ecb814f95cf1), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`bebae42`](https://github.com/shopware/frontends/commit/bebae42e58e3dd47f13bf166b0fb0d8ac9a416e3), [`782ef4d`](https://github.com/shopware/frontends/commit/782ef4d417dce6e6d60992bd54f876aa4bc5f45d), [`9643e56`](https://github.com/shopware/frontends/commit/9643e56dafba9282b75c12c96b2afb3a4738f86e), [`1583a7a`](https://github.com/shopware/frontends/commit/1583a7ae0d68b72fb362b625e1634e03bad68110), [`97d2859`](https://github.com/shopware/frontends/commit/97d2859e4dcbdc563200f2f64d1a20880b675d87), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`d60d062`](https://github.com/shopware/frontends/commit/d60d0620c7114a2f26bb2faf24241e2cbabc8798), [`a92941e`](https://github.com/shopware/frontends/commit/a92941ed59313fe85d5bbe204c2930d8a1a106b1), [`487d991`](https://github.com/shopware/frontends/commit/487d991f2cda0fbf637502597b20dd931498fe6a), [`013a1d6`](https://github.com/shopware/frontends/commit/013a1d6f88377686cfc1a85903a0c48d8fda67f5), [`53e7177`](https://github.com/shopware/frontends/commit/53e71770ad741bb558f193a95cae6bcc025a047f), [`99ad5e9`](https://github.com/shopware/frontends/commit/99ad5e99652771ea7cd5e1395708a878cca980f5), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`04ac2ad`](https://github.com/shopware/frontends/commit/04ac2ada522c881bb06565c332baf5f2cf08643d), [`e2c225f`](https://github.com/shopware/frontends/commit/e2c225f1d69a5d523f3c1e6c90449ee28f98b2f2), [`89a97a4`](https://github.com/shopware/frontends/commit/89a97a45ae4a58616e41f63e9884a2a67f0a6ce8), [`c729e70`](https://github.com/shopware/frontends/commit/c729e7014c70d7f71edf5297104065d18e482e04), [`864616f`](https://github.com/shopware/frontends/commit/864616f0c9e1cbe11e434b9a04a35ff9520bcb3c), [`8f0b468`](https://github.com/shopware/frontends/commit/8f0b46850a0b89667934c551431306f7d765f86b), [`97b5949`](https://github.com/shopware/frontends/commit/97b5949da2663700aa4047c4927b4a5f192cee74), [`05ca5b6`](https://github.com/shopware/frontends/commit/05ca5b68f098bc8969c2c50e270b19b00938513c), [`7a3a92c`](https://github.com/shopware/frontends/commit/7a3a92c3ee1a337e752adbcfa5057d30064eed7c), [`6664aa2`](https://github.com/shopware/frontends/commit/6664aa2aa48ec63fc053ad024a03940113e17956), [`479357c`](https://github.com/shopware/frontends/commit/479357c74d40c99218eb22ccd4089357ffab5872), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715), [`6b54268`](https://github.com/shopware/frontends/commit/6b54268049ae9b1b3d311b9a122f43a752a2b715)]:
  - @shopware-pwa/composables-next@1.0.0
  - @shopware/api-client@1.0.0
  - @shopware-pwa/helpers-next@1.0.0

## 0.9.1

### Patch Changes

- [#460](https://github.com/shopware/frontends/pull/460) [`729d03a5`](https://github.com/shopware/frontends/commit/729d03a5d5555a67d420cdb0c89a0cb4ce907831) Thanks [@mkucmus](https://github.com/mkucmus)! - Apply visibility and css classes for CMS layout

- Updated dependencies [[`729d03a5`](https://github.com/shopware/frontends/commit/729d03a5d5555a67d420cdb0c89a0cb4ce907831), [`c3aa09ee`](https://github.com/shopware/frontends/commit/c3aa09ee9e73c23b79bf9c1b3e5e63d7d39f1550), [`0e031efe`](https://github.com/shopware/frontends/commit/0e031efe7a3c0249a5e883c85ec87542ab07a4c0)]:
  - @shopware-pwa/helpers-next@0.5.1
  - @shopware-pwa/composables-next@0.14.1
  - @shopware-pwa/api-client@0.7.0

## 0.9.0

### Minor Changes

- [#445](https://github.com/shopware/frontends/pull/445) [`c264bf5d`](https://github.com/shopware/frontends/commit/c264bf5d41638c6013ebf14e7cd9615e5b5ef9bf) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - Adding the missing srcset attribute to the image tag in the CmsElementImage component. as well as adding support for HTML video elements as in Shopware management, it is possible for users to associate videos to any Cms image element.

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Changed types imports to `import type {...} from "..."`

### Patch Changes

- [#454](https://github.com/shopware/frontends/pull/454) [`07ef770d`](https://github.com/shopware/frontends/commit/07ef770d31b9331536ab9c846f4a8ce46e49ed84) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.8.0** to **^3.8.1**

- [#402](https://github.com/shopware/frontends/pull/402) [`9a89f409`](https://github.com/shopware/frontends/commit/9a89f40915c08ded0aee6140b42a12a18e74627f) Thanks [@mkucmus](https://github.com/mkucmus)! - Alignment to a11y standards

- [#435](https://github.com/shopware/frontends/pull/435) [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.4** to **^3.8.0**

- [#418](https://github.com/shopware/frontends/pull/418) [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.3** to **^3.7.4**

- [#413](https://github.com/shopware/frontends/pull/413) [`c6db572f`](https://github.com/shopware/frontends/commit/c6db572f0b041726d89c7e2e18eaed6864189f3a) Thanks [@mkucmus](https://github.com/mkucmus)! - Render <img> element in inner CMS content

- [#438](https://github.com/shopware/frontends/pull/438) [`f636e5a6`](https://github.com/shopware/frontends/commit/f636e5a648d2d13b83589b34e377f1d3fccc1cf7) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix url prefix builder

- [#420](https://github.com/shopware/frontends/pull/420) [`f3be470b`](https://github.com/shopware/frontends/commit/f3be470b42b536ba84a9ce968f440f9d6409bc19) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add category link resolver

- [#396](https://github.com/shopware/frontends/pull/396) [`dfc49b80`](https://github.com/shopware/frontends/commit/dfc49b80bcaa8e00b71e0dff6e35b413383274f5) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.7.1** to **^3.7.3**

- Updated dependencies [[`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`f5adaeba`](https://github.com/shopware/frontends/commit/f5adaeba6dec11422e0c02d92aba8caf56017af5), [`67cf5650`](https://github.com/shopware/frontends/commit/67cf56506f58973bf3ab8bb8acef06758a6a6720), [`c264bf5d`](https://github.com/shopware/frontends/commit/c264bf5d41638c6013ebf14e7cd9615e5b5ef9bf), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303), [`87213fb0`](https://github.com/shopware/frontends/commit/87213fb02b292b11f45b7fb5956fb8bc1ae33800), [`a4483ed8`](https://github.com/shopware/frontends/commit/a4483ed8bf9370e87aedeb81846fe9d31880b3e0), [`12ed75ff`](https://github.com/shopware/frontends/commit/12ed75ffd3d98bf2623161e44f63c40dfc1ef0e3), [`43510a10`](https://github.com/shopware/frontends/commit/43510a108d351aca361e460844b2cddd29f889b5), [`29f849d2`](https://github.com/shopware/frontends/commit/29f849d28c0d0ff8fc34f0d5e921ac2828c93f2b), [`85628cc6`](https://github.com/shopware/frontends/commit/85628cc65216417a887398f0838714fc03544303)]:
  - @shopware-pwa/composables-next@0.14.0
  - @shopware-pwa/api-client@0.7.0
  - @shopware-pwa/helpers-next@0.5.0

## 0.8.5

### Patch Changes

- [#385](https://github.com/shopware/frontends/pull/385) [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.5** to **^3.7.1**
  - Changed dependency _@vuelidate/validators_ from **^2.0.3** to **^2.0.4**

- Updated dependencies [[`211ccbb2`](https://github.com/shopware/frontends/commit/211ccbb2e4d9d6009847e6ff53099deb97d569de), [`b2b6905b`](https://github.com/shopware/frontends/commit/b2b6905beb8f28b79c0989ff9340c757e60001c9), [`61de0366`](https://github.com/shopware/frontends/commit/61de03662869e9ad8b69e2d8a868313a61a7a741), [`5d7e7973`](https://github.com/shopware/frontends/commit/5d7e7973437a4d74d19ec2fa0765c6d927bf8b2a)]:
  - @shopware-pwa/composables-next@0.13.3
  - @shopware-pwa/api-client@0.6.0
  - @shopware-pwa/helpers-next@0.4.0

## 0.8.4

### Patch Changes

- Updated dependencies [[`034e032`](https://github.com/shopware/frontends/commit/034e032270134cb51bb3da940d4b766d5866b1dd)]:
  - @shopware-pwa/helpers-next@0.4.0
  - @shopware-pwa/composables-next@0.13.2

## 0.8.3

### Patch Changes

- Updated dependencies [[`4532b60d`](https://github.com/shopware/frontends/commit/4532b60d449e1b5a45506fafa16eb7d156dc2359)]:
  - @shopware-pwa/api-client@0.6.0
  - @shopware-pwa/composables-next@0.13.1

## 0.8.2

### Patch Changes

- [#336](https://github.com/shopware/frontends/pull/336) [`d03228a`](https://github.com/shopware/frontends/commit/d03228a51058ec376b003e80dd0395237a12bfb6) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add prefix to the media link

- Updated dependencies [[`d03228a`](https://github.com/shopware/frontends/commit/d03228a51058ec376b003e80dd0395237a12bfb6), [`3683116`](https://github.com/shopware/frontends/commit/3683116588a7ef75e750fc33deee119f038c88e8)]:
  - @shopware-pwa/composables-next@0.13.0

## 0.8.1

### Patch Changes

- [#349](https://github.com/shopware/frontends/pull/349) [`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.3** to **^3.6.5**

- Updated dependencies [[`5d14bb5`](https://github.com/shopware/frontends/commit/5d14bb5df65fb14d630a8c4ab2b474fde04c477b)]:
  - @shopware-pwa/composables-next@0.12.1
  - @shopware-pwa/api-client@0.5.2
  - @shopware-pwa/helpers-next@0.3.2

## 0.8.0

### Minor Changes

- [#309](https://github.com/shopware/frontends/pull/309) [`84a7fe6`](https://github.com/shopware/frontends/commit/84a7fe6468041a4b12841fdf4844f3b38dfa387d) Thanks [@patzick](https://github.com/patzick)! - Images are now lazy loaded, saves data on initial page load

### Patch Changes

- [#303](https://github.com/shopware/frontends/pull/303) [`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d) Thanks [@patzick](https://github.com/patzick)! - Improved linting in packages. Types should be more reliable

- [#321](https://github.com/shopware/frontends/pull/321) [`f6f4d5c`](https://github.com/shopware/frontends/commit/f6f4d5c85e800c6d2067c6acd594a8711f43eea1) Thanks [@akf-bw](https://github.com/akf-bw)! - Fixed CMS apply error on missing UnoCSS

- [#313](https://github.com/shopware/frontends/pull/313) [`0e82ab3`](https://github.com/shopware/frontends/commit/0e82ab395cc88e992d2d64853d27603548c36bb9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.1** to **^3.6.2**
  - Changed dependency _@vuelidate/core_ from **^2.0.2** to **^2.0.3**
  - Changed dependency _@vuelidate/validators_ from **^2.0.2** to **^2.0.3**

- [#328](https://github.com/shopware/frontends/pull/328) [`a75617f`](https://github.com/shopware/frontends/commit/a75617f4104f7e66599aa5341e46759bb9d414c9) Thanks [@patzick](https://github.com/patzick)! - Dependency changes:

  - Changed dependency _@nuxt/kit_ from **^3.6.2** to **^3.6.3**

- Updated dependencies [[`aeb639a`](https://github.com/shopware/frontends/commit/aeb639a3244f812c275145345618e5bc0045be0d), [`8c6ff0a`](https://github.com/shopware/frontends/commit/8c6ff0ac87143a014f609aedd22aac99888da337), [`b9a2004`](https://github.com/shopware/frontends/commit/b9a20044d3df04370c62ab392b5144a62fbb57a9)]:
  - @shopware-pwa/composables-next@0.12.0
  - @shopware-pwa/api-client@0.5.2
  - @shopware-pwa/helpers-next@0.3.2

## 0.7.0

### Minor Changes

- [#283](https://github.com/shopware/frontends/pull/283) [`e6a52ec`](https://github.com/shopware/frontends/commit/e6a52ec4b7c28627c55cbd8ca15b8458cedf53bd) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - CmsElementText has now proper support for colors and align, when set in admin panel

### Patch Changes

- [#295](https://github.com/shopware/frontends/pull/295) [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`e6a52ec`](https://github.com/shopware/frontends/commit/e6a52ec4b7c28627c55cbd8ca15b8458cedf53bd), [`23a0a53`](https://github.com/shopware/frontends/commit/23a0a532410990c0075ea7fff622949ccdecfd49), [`bb48e13`](https://github.com/shopware/frontends/commit/bb48e131570a2db4b7431c842e54ad67d9384cd5), [`14d97c5`](https://github.com/shopware/frontends/commit/14d97c5942adf5a49163625b2740d95bc5772689)]:
  - @shopware-pwa/composables-next@0.11.0
  - @shopware-pwa/api-client@0.5.1
  - @shopware-pwa/helpers-next@0.3.1

## 0.6.1

### Patch Changes

- Updated dependencies [[`558c9d0`](https://github.com/shopware/frontends/commit/558c9d0f2127776a0542e8d1d95734cb5d4c7e75)]:
  - @shopware-pwa/composables-next@0.10.0

## 0.6.0

### Minor Changes

- [#230](https://github.com/shopware/frontends/pull/230) [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add language prefix to the links built on the CMS components

### Patch Changes

- [#274](https://github.com/shopware/frontends/pull/274) [`96d1290`](https://github.com/shopware/frontends/commit/96d12900e37a80d583ca003c4420b4f019652227) Thanks [@mkucmus](https://github.com/mkucmus)! - Redirect to the corresponding URL on variant change in PDP

- [#243](https://github.com/shopware/frontends/pull/243) [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`b9881b8`](https://github.com/shopware/frontends/commit/b9881b89da2605a5ccd78617d3f8ae8e05e8c43a), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`e359aa2`](https://github.com/shopware/frontends/commit/e359aa28c9c9c7fb2521be3ebd5b847c855e4d24), [`55db3a6`](https://github.com/shopware/frontends/commit/55db3a695ee6638f33f836890dad65742ddccf94), [`3ffd000`](https://github.com/shopware/frontends/commit/3ffd000195be60da9fbb3b41cd39fb9f4ab6167e), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb), [`b294182`](https://github.com/shopware/frontends/commit/b294182dbc9cda82a6d2b3c13663799a9f874c66), [`8a561b9`](https://github.com/shopware/frontends/commit/8a561b9aa12b50a816203c387417c2108761dcf9), [`d5f0bcc`](https://github.com/shopware/frontends/commit/d5f0bcc18cb581a48185cb8622d0e0d9b7fea23f), [`d1e07d6`](https://github.com/shopware/frontends/commit/d1e07d6f73135cb742807aba78f1271943d47beb)]:
  - @shopware-pwa/composables-next@0.9.0
  - @shopware-pwa/api-client@0.5.0
  - @shopware-pwa/helpers-next@0.3.0

## 0.5.2

### Patch Changes

- Updated dependencies [[`0242a3ad`](https://github.com/shopware/frontends/commit/0242a3adcde82e301f2e53fb562c0bbd767c04f9)]:
  - @shopware-pwa/composables-next@0.8.2

## 0.5.1

### Patch Changes

- updated changelog in readme

- Updated dependencies []:
  - @shopware-pwa/composables-next@0.8.1
  - @shopware-pwa/api-client@0.4.1
  - @shopware-pwa/helpers-next@0.2.1

## 0.5.0

### Minor Changes

- [#124](https://github.com/shopware/frontends/pull/124) [`8e30002d`](https://github.com/shopware/frontends/commit/8e30002d0c93cce6485e7e476386d55f755fc44b) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add translations inject

- [#180](https://github.com/shopware/frontends/pull/180) [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a) Thanks [@patzick](https://github.com/patzick)! - Images for CMS elements and Product cart are now optimised for displayed size. This is decreasing weight of the whole page. Also small thumbnail of the image is shown.

- [#180](https://github.com/shopware/frontends/pull/180) [`f1bd80b4`](https://github.com/shopware/frontends/commit/f1bd80b4082e2a23e94cfe4485f14715f125441a) Thanks [@patzick](https://github.com/patzick)! - Product Card design has changed.

### Patch Changes

- [#101](https://github.com/shopware/frontends/pull/101) [`58932a83`](https://github.com/shopware/frontends/commit/58932a83106f7c415e68c4c1555180ff844ec151) Thanks [@mkucmus](https://github.com/mkucmus)! - Show regulation price in product components

- [#177](https://github.com/shopware/frontends/pull/177) [`6320ca6f`](https://github.com/shopware/frontends/commit/6320ca6f00771b9f7d0a736c6438ca80ae60f33f) Thanks [@mkucmus](https://github.com/mkucmus)! - README enhancements

- Updated dependencies [[`0e85ad14`](https://github.com/shopware/frontends/commit/0e85ad14c7a115a9e4e79cb3d89e41129be30f03), [`3764736e`](https://github.com/shopware/frontends/commit/3764736e52fffb7f7abeb4c044dee2adc812cbb6), [`81f45335`](https://github.com/shopware/frontends/commit/81f4533513b2ee538111159f8e37cd7bd1db9f1e), [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b), [`e03c67a8`](https://github.com/shopware/frontends/commit/e03c67a8d553694be6e14e2c8d1a3f99b1b2ffbe), [`1fd1962f`](https://github.com/shopware/frontends/commit/1fd1962f7f4ee26461e8918e70e5f686fa431c6d), [`bb64070f`](https://github.com/shopware/frontends/commit/bb64070f69e47c14653c524d864f7a8ab8290724), [`693f9829`](https://github.com/shopware/frontends/commit/693f9829d5082307cb1f3b18d5b0217e42c6cf68), [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57), [`8dc64e31`](https://github.com/shopware/frontends/commit/8dc64e31756e8509866efdc2b52915b8862598cb), [`eddcfcca`](https://github.com/shopware/frontends/commit/eddcfcca8e00530147e77bd1122fc9e6828fbf57), [`7fe30878`](https://github.com/shopware/frontends/commit/7fe3087844007d12dc26d9c6817ecd12eb431b9b), [`0188b36a`](https://github.com/shopware/frontends/commit/0188b36acdf43278163a2fee74ff5b1c1aba55d8)]:
  - @shopware-pwa/composables-next@0.8.0
  - @shopware-pwa/helpers-next@0.2.0
  - @shopware-pwa/api-client@0.4.0

## 0.4.2

### Patch Changes

- fixed published packages readme

- Updated dependencies []:
  - @shopware-pwa/composables-next@0.7.1
  - @shopware-pwa/api-client@0.3.1
  - @shopware-pwa/helpers-next@0.1.26

## 0.4.1

### Patch Changes

- [`9c7a0f28`](https://github.com/shopware/frontends/commit/9c7a0f280c20ccbafca0e3063533820e21050bee) Thanks [@mkucmus](https://github.com/mkucmus)! - Adjust filter for manufacturer and properties in the listing

- [`7805daf4`](https://github.com/shopware/frontends/commit/7805daf4c0519e78bfa8cf1a9ae6011e75537244) Thanks [@mkucmus](https://github.com/mkucmus)! - Notification on failed action within wishlist

- [`e50702db`](https://github.com/shopware/frontends/commit/e50702db725086a97f182a7213eaf03c913cd870) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add flex to the CmsBlockTextTwoColumn

- [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99) Thanks [@mkucmus](https://github.com/mkucmus)! - Prevent displaying not mapped texts & images elements with no URL

- [`e54e494a`](https://github.com/shopware/frontends/commit/e54e494aefa4d9418c0daf7e3b805b3b17d18c15) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Adjust product page styles

- Updated dependencies [[`e2718c7d`](https://github.com/shopware/frontends/commit/e2718c7d20fac95c57436166083d6e5f599937c2), [`50e74be5`](https://github.com/shopware/frontends/commit/50e74be52034d1947e273985f778e986f077db44), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`d358854c`](https://github.com/shopware/frontends/commit/d358854c632447228e719efdf639c428cf6ba804), [`dab0f839`](https://github.com/shopware/frontends/commit/dab0f839eeebe6bb9999cdd0ec11925d935b08b9), [`ec030631`](https://github.com/shopware/frontends/commit/ec0306312fa42451f5f4a98c3e8985b70496fd37), [`5008dcbf`](https://github.com/shopware/frontends/commit/5008dcbf065fc54a3f51517460e409556f370adf), [`da2f6897`](https://github.com/shopware/frontends/commit/da2f6897e6839fbeb3ba7eae1eac376f423f2f99), [`0eaf57e1`](https://github.com/shopware/frontends/commit/0eaf57e17a1d8ee454533c33f7528b72021aed4b), [`30493417`](https://github.com/shopware/frontends/commit/30493417ad5b97ee1f0553f68357a23446b85522), [`e13d3d9a`](https://github.com/shopware/frontends/commit/e13d3d9adde759e97ca7fa9b7a782b7991428679), [`909ffcde`](https://github.com/shopware/frontends/commit/909ffcde24d5ae873d814027be0920a9e5976c72), [`a15a3083`](https://github.com/shopware/frontends/commit/a15a308359497bb9d483bebe040d717114946ff0), [`e71cc788`](https://github.com/shopware/frontends/commit/e71cc788c375c19ec449b820c0813b83503ef067)]:
  - @shopware-pwa/helpers-next@0.1.25
  - @shopware-pwa/composables-next@0.7.0
  - @shopware-pwa/api-client@0.3.0

## 0.4.0

### Minor Changes

- [`7aa2c640`](https://github.com/shopware/frontends/commit/7aa2c640203e24b6abb5b8fe0eff6d7b72e6b08d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Adjust products listing filters

### Patch Changes

- [`ece79b02`](https://github.com/shopware/frontends/commit/ece79b021c25499ac9ac4d54b707f27f9e25eb68) Thanks [@patzick](https://github.com/patzick)! - Removed old `_debounce` usage, we should use `useDebounceFn` from Vueuse

- [`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- Updated dependencies [[`680b4b77`](https://github.com/shopware/frontends/commit/680b4b778859f5f2fdf2325ce349f5534d3b965f), [`313e0810`](https://github.com/shopware/frontends/commit/313e0810014611a0429b76b51747536630f24627)]:
  - @shopware-pwa/composables-next@0.6.0
  - @shopware-pwa/api-client@0.2.3
  - @shopware-pwa/helpers-next@0.1.24

## 0.3.0

### Minor Changes

- [`21acce67`](https://github.com/shopware/frontends/commit/21acce67d05a2f1fcc1441174f7b4159b0b5b5d0) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Move html-to-vue into the project

- [`073073b6`](https://github.com/shopware/frontends/commit/073073b627a444050e969ebf33933b1a27a2fa3f) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Replace html-parse-stringify with html-to-ast

- [`0855add8`](https://github.com/shopware/frontends/commit/0855add83ca04e816caed65a0538c1dbf624bb0d) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add the URL query navigation to the product listing

- [`6c045a44`](https://github.com/shopware/frontends/commit/6c045a44242dad42571df6ce82c564e07031d373) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add images to the filters

### Patch Changes

- [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4) Thanks [@patzick](https://github.com/patzick)! - start deploying canary versions

- [`deaf9d1b`](https://github.com/shopware/frontends/commit/deaf9d1b60f5b32862e6e1bbf25e1a45c5361cdc) Thanks [@patzick](https://github.com/patzick)! - use translated name property for listing filter label

- Updated dependencies [[`57d720ab`](https://github.com/shopware/frontends/commit/57d720ab6c8f605de605dbbe9de53d4ce43347e5), [`29deb04f`](https://github.com/shopware/frontends/commit/29deb04fd1a871cb28f1fe3af3c007ae21de999f), [`ccf4ed47`](https://github.com/shopware/frontends/commit/ccf4ed47e6bb46d1fcab7c1418a677fe575331b4), [`0a8f4ea1`](https://github.com/shopware/frontends/commit/0a8f4ea1a95cd684178ae412687575bf735894a7), [`4d5b04b5`](https://github.com/shopware/frontends/commit/4d5b04b5fa09910b0c02bc59b33534772da66eeb), [`77a0bbcd`](https://github.com/shopware/frontends/commit/77a0bbcd8a5ce830219e2c04c0c99d08e6c4f4f2), [`c300b89b`](https://github.com/shopware/frontends/commit/c300b89b80cf3476e8023db1796cec972db519f8), [`0855add8`](https://github.com/shopware/frontends/commit/0855add83ca04e816caed65a0538c1dbf624bb0d), [`39d2d11c`](https://github.com/shopware/frontends/commit/39d2d11c922f5de9eb5d5c25225b6b93edd8ebcb), [`4fc1cd83`](https://github.com/shopware/frontends/commit/4fc1cd833a9ebca73536b2be45cfec35f6a27dfc), [`f364da48`](https://github.com/shopware/frontends/commit/f364da4881b2c172947e394fcd8e23ddc3689a51), [`21d8331a`](https://github.com/shopware/frontends/commit/21d8331aff13cef7ed041c60376504b2f324c1f5)]:
  - @shopware-pwa/composables-next@0.5.0
  - @shopware-pwa/api-client@0.2.2
  - @shopware-pwa/helpers-next@0.1.23

## 0.2.1

### Patch Changes

- [`412a3bd`](https://github.com/shopware/frontends/commit/412a3bde4a3d12b54ef3af2d9b8f030c7a605885) Thanks [@patzick](https://github.com/patzick)! - fix problem with missing `vuelidate` dependency for standalone usage

- [`7ec2875`](https://github.com/shopware/frontends/commit/7ec2875f51e46e6b80756b848594011dd471e01e) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Fix the scope of the CmsElementText styles

- [`412a3bd`](https://github.com/shopware/frontends/commit/412a3bde4a3d12b54ef3af2d9b8f030c7a605885) Thanks [@patzick](https://github.com/patzick)! - fixed problem with default export in html-to-vue usage in `CmsTextElement` component

- Updated dependencies [[`7310ca6`](https://github.com/shopware/frontends/commit/7310ca64506ca5418d3ec2ef80f5c7d0fe4b779c), [`e21d67b`](https://github.com/shopware/frontends/commit/e21d67bc142076e93630139232ea39a07b51ebfb)]:
  - @shopware-pwa/composables-next@0.4.0
  - @shopware-pwa/api-client@0.2.1
  - @shopware-pwa/helpers-next@0.1.22

## 0.2.0

### Minor Changes

- [`68b95b0`](https://github.com/shopware/frontends/commit/68b95b06f71b0e9b08da7c0936eee28311f178a8) Thanks [@mkucmus](https://github.com/mkucmus)! - listing filters hydration and top navigation submenu access

- [`c0b9cc3`](https://github.com/shopware/frontends/commit/c0b9cc35fdb588ef5e580dc7e19fa4414ba64d04) Thanks [@mkucmus](https://github.com/mkucmus)! - Price displaying strategy

- [`d7da2c1`](https://github.com/shopware/frontends/commit/d7da2c11b6cbef23a83d0ffdb95d7e382795b7f3) Thanks [@BrocksiNet](https://github.com/BrocksiNet)! - change of html entites parser library

### Patch Changes

- [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953) Thanks [@patzick](https://github.com/patzick)! - bump dependencies

- [`802abb1`](https://github.com/shopware/frontends/commit/802abb1b47cb9b2ba1dac267c7ce42bc32dce5f8) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Add new data-testid attributes

- Updated dependencies [[`b3f711c`](https://github.com/shopware/frontends/commit/b3f711ccb230025c0567b0a06a292bf9255a4992), [`9cd4078`](https://github.com/shopware/frontends/commit/9cd4078433c5644d2153a8a1212b9076a8d37347), [`29b677e`](https://github.com/shopware/frontends/commit/29b677e4ff59656f8a457ee4c8ab35e36cd06953), [`c0b9cc3`](https://github.com/shopware/frontends/commit/c0b9cc35fdb588ef5e580dc7e19fa4414ba64d04)]:
  - @shopware-pwa/api-client@0.2.0
  - @shopware-pwa/composables-next@0.3.0
  - @shopware-pwa/helpers-next@0.1.21

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
  - @shopware-pwa/helpers-next@0.1.20
