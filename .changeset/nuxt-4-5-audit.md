---
"@shopware/nuxt-module": patch
"@shopware/cms-base-layer": patch
"@shopware/composables": patch
---

Update Nuxt to 4.5 and resolve dependency audit issues. The Shopware Nuxt plugin now declares its injection types explicitly, avoiding a recursive `NuxtApp` type error with Nuxt 4.5.
