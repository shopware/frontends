---
"@shopware/composables": patch
"@shopware/cms-base-layer": patch
---

Build and test against the `vue` (`3.5.45`) and `@vueuse/core` (`15.0.0`) versions the package declares. The workspace overrides still pinned `vue` to `3.5.44` and `@vueuse/*` to `14.4.0`, so the released code was verified against older versions than the ones it ships with.
