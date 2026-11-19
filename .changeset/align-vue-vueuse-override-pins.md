---
"@shopware/composables": patch
"@shopware/cms-base-layer": patch
---

Build and test against the `vue` (`3.5.45`) and `@vueuse/core` (`15.0.0`) versions the package declares. The workspace overrides still pinned `vue` to `3.5.44` and `@vueuse/*` to `14.4.0`, so the released code was verified against older versions than the ones it ships with.

If your project type-checks with TypeScript 5.9 and `skipLibCheck: false`, `@vueuse/core` 15 types fail on the missing global `Temporal` (TypeScript adds it in the `ESNext` lib from 6.0), so upgrade to TypeScript 6 or add the `Temporal` types, e.g. `temporal-polyfill/global` in `compilerOptions.types`.
