---
"@shopware/nuxt-module": patch
"@shopware/cms-base-layer": patch
"@shopware/unocss-design-tokens-layer": patch
"vue-starter-template": patch
"lumora-demo-store": patch
"vue-blank": patch
"vue-demo-store": patch
---

Support Nuxt 4.6. `@shopware/nuxt-module` and `@shopware/cms-base-layer` now depend on `@nuxt/kit` 4.6.1, and the Nuxt plugin accepts Nuxt 4.6's `NuxtRequestEvent` type for `ssrContext.event`. The Nuxt templates require Node `^22.22.3 || ^24.15.0 || >=26.0.0`, the range Nuxt 4.6 supports. `@shopware/unocss-design-tokens-layer` no longer re-exports its generated `.nuxt/imports` from `index.d.ts`, which pulled server routes into the shared type context of apps extending the layer.
