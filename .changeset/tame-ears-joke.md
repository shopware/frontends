---
"@shopware-pwa/nuxt3-module": patch
---

This improves performance slightly when developing; we can avoid loading the entire barrel file at `#app` by using the new granular imports merged in https://github.com/nuxt/nuxt/pull/23951.
