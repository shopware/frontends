---
"@shopware/nuxt-module": patch
"@shopware/cms-base-layer": patch
"@shopware/composables": patch
---

Update `@nuxt/kit` to 4.7.0, in line with the Nuxt 4.7.0 bump that fixes GHSA-jxc9-w3j6-pwp2, GHSA-vrh2-cfcx-c3fg and GHSA-h5xj-x893-p5f7. `@shopware/nuxt-module` now declares `@nuxt/devtools-kit` as a dependency. Nuxt 4.7 no longer ships it transitively. `@shopware/cms-base-layer` now depends on `vue` 3.5.46, the version Nuxt 4.7 requires. Align your project's `vue` pin to 3.5.46, or upgrade to Nuxt 4.7. `@shopware/composables` is built and tested against the same versions.
